import type { MetadataRoute } from "next";
import { getVisibleFish } from "@/lib/fish";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/chinh-sach",
    "/lien-he",
    ...getVisibleFish().map((fish) => `/ca/${fish.slug}`),
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
