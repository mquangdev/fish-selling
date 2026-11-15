import rawFish from "@/data/fish.json";

export type FishStatus = "available" | "sold_out" | "coming_soon" | "hidden";
export type FishCategory = "pleco" | "molly";

export interface FishVariant {
  label: string;
  sizeCm: string;
  /** VND, integer. null = ask on Zalo. */
  price: number | null;
  /** null = unknown. */
  stock: number | null;
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
  images: { src: string; alt: string }[];
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
    item.variants.forEach((v: unknown, i: number) => {
      const at = `variants[${i}]`;
      if (!isObj(v)) return err(`${at} must be an object`);
      if (!isNonEmptyString(v.label)) err(`${at}.label must be a non-empty string`);
      if (!isNonEmptyString(v.sizeCm)) err(`${at}.sizeCm must be a non-empty string`);
      if (v.price !== null && !isNonNegativeInt(v.price)) {
        err(`${at}.price must be null or a non-negative integer (got ${String(v.price)})`);
      }
      if (v.stock !== null && !isNonNegativeInt(v.stock)) {
        err(`${at}.stock must be null or a non-negative integer (got ${String(v.stock)})`);
      }
    });
  }

  if (!Array.isArray(item.images)) {
    err(`"images" must be an array`);
  } else {
    item.images.forEach((img: unknown, i: number) => {
      if (!isObj(img) || !isNonEmptyString(img.src) || !isNonEmptyString(img.alt)) {
        err(`images[${i}] needs non-empty "src" and "alt"`);
      }
    });
  }
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
