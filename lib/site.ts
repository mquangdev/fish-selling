import rawSite from "@/data/site.json";

/**
 * Central site configuration, loaded from data/site.json and validated at
 * build time (like data/fish.json). A missing value is null so the UI can show
 * an explicit placeholder instead of an invented value.
 */

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface PolicySection {
  id: string;
  title: string;
  /** Paragraphs. null = not decided yet; the page shows a placeholder. */
  body: string[] | null;
}

export interface SiteData {
  name: string;
  description: string;
  contact: {
    phone: string | null;
    zaloUrl: string | null;
    socials: SocialLink[];
    address: string | null;
    pickupNote: string | null;
    replyHours: string | null;
  };
  policy: {
    intro: string | null;
    sections: PolicySection[];
  };
}

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Only http(s) links are allowed (blocks javascript: and similar). */
function isHttpUrl(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Validates raw site data and returns it typed. Throws one Error listing every
 * problem so a bad data/site.json fails the build early.
 */
export function validateSite(raw: unknown): SiteData {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(msg);

  if (!isObj(raw)) {
    throw new Error("Invalid data/site.json: root must be an object");
  }
  if (!isNonEmptyString(raw.name)) err(`"name" must be a non-empty string`);
  if (!isNonEmptyString(raw.description)) {
    err(`"description" must be a non-empty string`);
  }

  const contact = raw.contact;
  if (!isObj(contact)) {
    err(`"contact" must be an object`);
  } else {
    if (contact.phone !== null && !(isNonEmptyString(contact.phone) && /\d/.test(contact.phone))) {
      err(`contact.phone must be null or a string containing digits`);
    }
    if (contact.zaloUrl !== null && !isHttpUrl(contact.zaloUrl)) {
      err(`contact.zaloUrl must be null or an http(s) URL`);
    }
    for (const key of ["address", "pickupNote", "replyHours"]) {
      if (contact[key] !== null && !isNonEmptyString(contact[key])) {
        err(`contact.${key} must be null or a non-empty string`);
      }
    }
    if (!Array.isArray(contact.socials)) {
      err(`contact.socials must be an array`);
    } else {
      const ids = new Set<string>();
      contact.socials.forEach((item: unknown, i: number) => {
        const at = `contact.socials[${i}]`;
        if (!isObj(item)) return err(`${at} must be an object`);
        if (!isNonEmptyString(item.id) || !ID_PATTERN.test(item.id)) {
          err(`${at}.id must be lowercase ASCII kebab-case`);
        } else if (ids.has(item.id)) {
          err(`${at}.id "${item.id}" is duplicated`);
        } else {
          ids.add(item.id);
        }
        if (!isNonEmptyString(item.label)) err(`${at}.label must be a non-empty string`);
        if (!isHttpUrl(item.url)) err(`${at}.url must be an http(s) URL`);
      });
    }
  }

  const policy = raw.policy;
  if (!isObj(policy)) {
    err(`"policy" must be an object`);
  } else {
    if (policy.intro !== null && !isNonEmptyString(policy.intro)) {
      err(`policy.intro must be null or a non-empty string`);
    }
    if (!Array.isArray(policy.sections)) {
      err(`policy.sections must be an array`);
    } else {
      const ids = new Set<string>();
      policy.sections.forEach((item: unknown, i: number) => {
        const at = `policy.sections[${i}]`;
        if (!isObj(item)) return err(`${at} must be an object`);
        if (!isNonEmptyString(item.id) || !ID_PATTERN.test(item.id)) {
          err(`${at}.id must be lowercase ASCII kebab-case`);
        } else if (ids.has(item.id)) {
          err(`${at}.id "${item.id}" is duplicated`);
        } else {
          ids.add(item.id);
        }
        if (!isNonEmptyString(item.title)) err(`${at}.title must be a non-empty string`);
        if (
          item.body !== null &&
          !(Array.isArray(item.body) && item.body.length > 0 && item.body.every(isNonEmptyString))
        ) {
          err(`${at}.body must be null or a non-empty array of non-empty strings`);
        }
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid data/site.json (${errors.length} problem${errors.length > 1 ? "s" : ""}):\n- ${errors.join("\n- ")}`,
    );
  }
  return raw as unknown as SiteData;
}

// Validated at module load: any page importing this file fails the build
// if data/site.json is invalid.
export const siteData: SiteData = validateSite(rawSite);

export const SITE_NAME = siteData.name;
export const SITE_DESCRIPTION = siteData.description;

export const PLACEHOLDER = "[CẦN BỔ SUNG]";

export const siteConfig = {
  /** Deployment URL (env), used for sitemap and canonical links. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
  zaloUrl: siteData.contact.zaloUrl,
  phone: siteData.contact.phone,
  socials: siteData.contact.socials,
  address: siteData.contact.address,
  pickupNote: siteData.contact.pickupNote,
  replyHours: siteData.contact.replyHours,
};

/** `tel:` link built from the displayed phone number, or null if unset. */
export function getPhoneHref(): string | null {
  if (!siteConfig.phone) return null;
  const digits = siteConfig.phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}
