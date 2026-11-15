import rawFish from "@/data/fish.json";

export type FishStatus = "available" | "sold_out" | "coming_soon" | "hidden";
export type FishCategory = "pleco" | "molly";

export type VariantStatus = "available" | "sold_out";

export interface FishImage {
  src: string;
  alt: string;
}

export interface FishVariant {
  /** Unique within a fish, ASCII kebab-case. Used for keys and the image folder. */
  id: string;
  /** Grade group, e.g. "Phẩm đẹp". null when the fish has no grades. */
  grade: string | null;
  label: string;
  /** null = unknown. */
  sizeCm: string | null;
  /** VND, integer. null = ask on Zalo. */
  price: number | null;
  /** null = unknown. */
  stock: number | null;
  status: VariantStatus;
  /** Photos of this variant. May be empty. */
  images: FishImage[];
}

export interface Fish {
  /** Unique, ASCII, used as the URL segment. */
  slug: string;
  name: string;
  commonName: string;
  scientificName: string;
  category: FishCategory;
  status: FishStatus;
  tagline: string;
  description: string;
  variants: FishVariant[];
  images: FishImage[];
  videos: { src: string; title: string }[];
  care: {
    temperatureC: [number, number];
    ph: [number, number];
    adultSizeCm: number;
    minTankLiters: number;
    temperament: string;
    diet: string;
    tips: string[];
  };
  breeding: { source: string; generation: string | null; note: string | null };
  seo: { title: string; description: string };
  /** Internal notes for the owner. Must NEVER be rendered or sent to the client. */
  todo?: string[];
}

const STATUSES: readonly FishStatus[] = [
  "available",
  "sold_out",
  "coming_soon",
  "hidden",
];
const VARIANT_STATUSES: readonly VariantStatus[] = ["available", "sold_out"];
const CATEGORIES: readonly FishCategory[] = ["pleco", "molly"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isRange(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((n) => typeof n === "number" && Number.isFinite(n)) &&
    value[0] <= value[1]
  );
}

function checkImages(
  value: unknown,
  at: string,
  err: (msg: string) => void,
): void {
  if (!Array.isArray(value)) {
    err(`${at} must be an array`);
    return;
  }
  value.forEach((img: unknown, i: number) => {
    if (!isObj(img) || !isNonEmptyString(img.src) || !isNonEmptyString(img.alt)) {
      err(`${at}[${i}] needs non-empty "src" and "alt"`);
    }
  });
}

function validateOne(item: unknown, index: number, errors: string[]): void {
  if (!isObj(item)) {
    errors.push(`#${index}: must be an object`);
    return;
  }
  const id = isNonEmptyString(item.slug) ? item.slug : `#${index}`;
  const err = (msg: string) => errors.push(`${id}: ${msg}`);

  for (const key of [
    "slug",
    "name",
    "commonName",
    "scientificName",
    "tagline",
    "description",
  ]) {
    if (!isNonEmptyString(item[key])) err(`"${key}" must be a non-empty string`);
  }
  if (isNonEmptyString(item.slug) && !SLUG_PATTERN.test(item.slug)) {
    err(`"slug" must be lowercase ASCII kebab-case`);
  }
  if (!CATEGORIES.includes(item.category as FishCategory)) {
    err(`"category" must be one of ${CATEGORIES.join(", ")}`);
  }
  if (!STATUSES.includes(item.status as FishStatus)) {
    err(`"status" must be one of ${STATUSES.join(", ")}`);
  }

  if (!Array.isArray(item.variants)) {
    err(`"variants" must be an array`);
  } else {
    const variantIds = new Set<string>();
    let availableCount = 0;
    item.variants.forEach((v: unknown, i: number) => {
      const at = `variants[${i}]`;
      if (!isObj(v)) return err(`${at} must be an object`);
      if (!isNonEmptyString(v.id) || !SLUG_PATTERN.test(v.id)) {
        err(`${at}.id must be lowercase ASCII kebab-case`);
      } else if (variantIds.has(v.id)) {
        err(`${at}.id "${v.id}" is duplicated`);
      } else {
        variantIds.add(v.id);
      }
      if (v.grade !== null && !isNonEmptyString(v.grade)) {
        err(`${at}.grade must be null or a non-empty string`);
      }
      if (!isNonEmptyString(v.label)) err(`${at}.label must be a non-empty string`);
      if (v.sizeCm !== null && !isNonEmptyString(v.sizeCm)) {
        err(`${at}.sizeCm must be null or a non-empty string`);
      }
      if (v.price !== null && !isNonNegativeInt(v.price)) {
        err(`${at}.price must be null or a non-negative integer (got ${String(v.price)})`);
      }
      if (v.stock !== null && !isNonNegativeInt(v.stock)) {
        err(`${at}.stock must be null or a non-negative integer (got ${String(v.stock)})`);
      }
      if (!VARIANT_STATUSES.includes(v.status as VariantStatus)) {
        err(`${at}.status must be one of ${VARIANT_STATUSES.join(", ")}`);
      } else if (v.status === "available") {
        availableCount += 1;
      }
      checkImages(v.images, `${at}.images`, err);
    });
    // Fish status and variant availability must agree.
    if (item.variants.length > 0) {
      if (item.status === "available" && availableCount === 0) {
        err(`status is "available" but every variant is sold out`);
      }
      if (item.status === "sold_out" && availableCount > 0) {
        err(`status is "sold_out" but some variants are still available`);
      }
    }
  }

  checkImages(item.images, "images", err);
  if (!Array.isArray(item.videos)) {
    err(`"videos" must be an array`);
  } else {
    item.videos.forEach((vid: unknown, i: number) => {
      if (!isObj(vid) || !isNonEmptyString(vid.src) || !isNonEmptyString(vid.title)) {
        err(`videos[${i}] needs non-empty "src" and "title"`);
      }
    });
  }

  const care = item.care;
  if (!isObj(care)) {
    err(`"care" must be an object`);
  } else {
    if (!isRange(care.temperatureC)) err(`care.temperatureC must be [min, max] numbers`);
    if (!isRange(care.ph)) err(`care.ph must be [min, max] numbers`);
    if (typeof care.adultSizeCm !== "number" || !(care.adultSizeCm > 0)) {
      err(`care.adultSizeCm must be a positive number`);
    }
    if (typeof care.minTankLiters !== "number" || !(care.minTankLiters > 0)) {
      err(`care.minTankLiters must be a positive number`);
    }
    if (!isNonEmptyString(care.temperament)) err(`care.temperament must be a non-empty string`);
    if (!isNonEmptyString(care.diet)) err(`care.diet must be a non-empty string`);
    if (!Array.isArray(care.tips) || !care.tips.every(isNonEmptyString)) {
      err(`care.tips must be an array of non-empty strings`);
    }
  }

  const breeding = item.breeding;
  if (!isObj(breeding)) {
    err(`"breeding" must be an object`);
  } else {
    if (!isNonEmptyString(breeding.source)) err(`breeding.source must be a non-empty string`);
    for (const key of ["generation", "note"]) {
      if (breeding[key] !== null && typeof breeding[key] !== "string") {
        err(`breeding.${key} must be a string or null`);
      }
    }
  }

  const seo = item.seo;
  if (!isObj(seo) || !isNonEmptyString(seo.title) || !isNonEmptyString(seo.description)) {
    err(`"seo" needs non-empty "title" and "description"`);
  }

  if (
    item.todo !== undefined &&
    (!Array.isArray(item.todo) || !item.todo.every((t) => typeof t === "string"))
  ) {
    err(`"todo" must be an array of strings when present`);
  }
}

/**
 * Validates raw fish data and returns it typed.
 * Throws one Error listing every problem found, so a bad data/fish.json
 * fails the build early instead of breaking pages at runtime.
 */
export function validateFish(raw: unknown): Fish[] {
  if (!Array.isArray(raw)) {
    throw new Error("Invalid data/fish.json: root must be an array");
  }
  const errors: string[] = [];
  const seen = new Set<string>();
  raw.forEach((item, index) => {
    validateOne(item, index, errors);
    if (isObj(item) && isNonEmptyString(item.slug)) {
      if (seen.has(item.slug)) errors.push(`${item.slug}: duplicate slug`);
      seen.add(item.slug);
    }
  });
  if (errors.length > 0) {
    throw new Error(
      `Invalid data/fish.json (${errors.length} problem${errors.length > 1 ? "s" : ""}):\n- ${errors.join("\n- ")}`,
    );
  }
  return raw as Fish[];
}

// Validated at module load: any page that imports this file fails the build
// if data/fish.json is invalid.
const allFish: Fish[] = validateFish(rawFish);

const priceFormatter = new Intl.NumberFormat("vi-VN");

/** Formats a VND price. null (or any invalid value) renders as "Liên hệ". */
export function formatPrice(price: number | null): string {
  if (price === null || !isNonNegativeInt(price) || price === 0) {
    return "Liên hệ";
  }
  return `${priceFormatter.format(price)} ₫`;
}

/** Customer-facing label for each status. */
export const STATUS_LABELS: Record<FishStatus, string> = {
  available: "Còn cá",
  sold_out: "Hết hàng",
  coming_soon: "Sắp có",
  hidden: "",
};

/** Formats a [min, max] range with a decimal comma, e.g. [6.5, 7.5] -> "6,5-7,5". */
export function formatRange([min, max]: [number, number]): string {
  const format = (value: number) => String(value).replace(".", ",");
  return min === max ? format(min) : `${format(min)}-${format(max)}`;
}

/** Zalo call-to-action label per status. No promises about pre-orders. */
export const ZALO_LABELS: Record<FishStatus, string> = {
  available: "Hỏi mua qua Zalo",
  sold_out: "Nhắn Zalo hỏi lô sau",
  coming_soon: "Nhắn Zalo hỏi lô sắp có",
  hidden: "Nhắn Zalo",
};

/** Sample message the customer can copy into Zalo. */
export function getZaloMessage(fish: Fish): string {
  return `Chào shop, mình muốn hỏi về ${fish.name}. Cho mình xin thông tin size, giá và tình trạng nhé.`;
}

/** Combined size range across variants, e.g. "2-5 cm". null if unknown. */
export function getSizeRange(fish: Fish): string | null {
  const numbers = fish.variants
    .flatMap((variant) => variant.sizeCm?.match(/\d+(?:[.,]\d+)?/g) ?? [])
    .map((value) => Number(value.replace(",", ".")))
    .filter((value) => Number.isFinite(value));
  if (numbers.length === 0) return null;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  return min === max ? `${min} cm` : `${min}-${max} cm`;
}

/**
 * Lowest known price among in-stock variants (falls back to all variants when
 * nothing is in stock). null when every price is "contact".
 */
export function getStartingPrice(fish: Fish): number | null {
  const inStock = fish.variants.filter((v) => v.status === "available");
  const pool = inStock.length > 0 ? inStock : fish.variants;
  const prices = pool
    .map((variant) => variant.price)
    .filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

export interface VariantGroup {
  /** null when the fish has no grades. */
  grade: string | null;
  variants: FishVariant[];
}

/** Groups variants by grade, keeping the order in which grades first appear. */
export function groupVariantsByGrade(variants: FishVariant[]): VariantGroup[] {
  const groups: VariantGroup[] = [];
  for (const variant of variants) {
    const group = groups.find((item) => item.grade === variant.grade);
    if (group) group.variants.push(variant);
    else groups.push({ grade: variant.grade, variants: [variant] });
  }
  return groups;
}

export function getAllFish(): Fish[] {
  return allFish;
}

/** Fish shown on the site (status other than "hidden"). */
export function getVisibleFish(): Fish[] {
  return allFish.filter((fish) => fish.status !== "hidden");
}

export function getFishBySlug(slug: string): Fish | undefined {
  return allFish.find((fish) => fish.slug === slug);
}
