import { jsonLdString } from "@/lib/seo";

/** Renders structured data for search engines. `data` must be public content only. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
