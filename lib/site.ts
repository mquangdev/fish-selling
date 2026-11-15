/**
 * Central site configuration. Contact info comes only from env vars
 * (see .env.example). A missing value is null so the UI can show an
 * explicit placeholder instead of an invented value.
 */

function readEnv(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Placeholder until the owner provides the farm name. */
export const SITE_NAME = "[TÊN TRẠI]";
export const SITE_DESCRIPTION =
  "Cá cảnh nhà nuôi: pleco và molly khỏe, dễ nuôi. Nhắn Zalo để biết size và giá.";

export const PLACEHOLDER = "[CẦN BỔ SUNG]";

export const siteConfig = {
  url: readEnv(process.env.NEXT_PUBLIC_SITE_URL),
  zaloUrl: readEnv(process.env.NEXT_PUBLIC_ZALO_URL),
  phone: readEnv(process.env.NEXT_PUBLIC_PHONE),
  facebookUrl: readEnv(process.env.NEXT_PUBLIC_FACEBOOK_URL),
};

/** `tel:` link built from the displayed phone number, or null if unset. */
export function getPhoneHref(): string | null {
  if (!siteConfig.phone) return null;
  const digits = siteConfig.phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}
