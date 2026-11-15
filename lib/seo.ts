import type { Metadata } from "next";
import type { Fish } from "@/lib/fish";
import { SITE_NAME } from "@/lib/site";

export const DEFAULT_TITLE = `${SITE_NAME} | Cá cảnh nhà nuôi`;

/**
 * Public base URL of the site.
 * Priority: NEXT_PUBLIC_SITE_URL, then the URL Vercel provides for the
 * deployment, then localhost (so local builds and CI do not fail).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isPreview = process.env.VERCEL_ENV === "preview";
  const vercelHost = isPreview
    ? process.env.VERCEL_URL?.trim()
    : process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
      process.env.VERCEL_URL?.trim();

  const raw = explicit || vercelHost || "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

/** Absolute URL for a site path such as "/ca/molly-sanke". */
export function absoluteUrl(path: string): string {
  // The home page is the bare origin, matching what the canonical link shows.
  if (path === "/" || path === "") return getSiteUrl();
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetadataInput {
  title: string;
  description: string;
  /** Site path, e.g. "/chinh-sach". */
  path: string;
  /** Optional share image (a path under public/). */
  image?: { src: string; alt: string };
}

/**
 * Metadata for a page: title, description, canonical, Open Graph and Twitter.
 * Open Graph is replaced (not merged) per page, so everything is set here.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image.src) : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: SITE_NAME,
      title,
      description,
      url,
      ...(image && imageUrl
        ? { images: [{ url: imageUrl, alt: image.alt }] }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

/**
 * schema.org Product data for a fish page. `offers` is only present when at
 * least one variant has a price; `image` only when the fish has photos.
 */
export function buildProductJsonLd(fish: Fish): Record<string, unknown> {
  const url = absoluteUrl(`/ca/${fish.slug}`);

  const offers = fish.variants
    .filter((variant) => variant.price !== null)
    .map((variant) => ({
      "@type": "Offer",
      name: variant.grade ? `${variant.grade} - ${variant.label}` : variant.label,
      price: variant.price,
      priceCurrency: "VND",
      availability:
        variant.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    }));

  const images = fish.images.map((image) => absoluteUrl(image.src));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: fish.name,
    description: fish.description,
    url,
    category: "Cá cảnh",
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(images.length > 0 ? { image: images } : {}),
    ...(offers.length > 0 ? { offers } : {}),
  };
}

/** Serializes JSON-LD for a script tag; "<" is escaped so it cannot close the tag. */
export function jsonLdString(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
