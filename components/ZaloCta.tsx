import { PLACEHOLDER, siteConfig } from "@/lib/site";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold";

/**
 * Zalo call-to-action. Falls back to a visible placeholder (not a link)
 * when the Zalo URL is not configured.
 */
export default function ZaloCta({
  label = "Nhắn Zalo",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  if (!siteConfig.zaloUrl) {
    return (
      <span className={`${base} bg-amber-100 text-amber-900 ${className}`}>
        {PLACEHOLDER} Zalo
      </span>
    );
  }
  return (
    <a
      href={siteConfig.zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-accent text-white hover:bg-accent-dark ${className}`}
    >
      {label}
    </a>
  );
}
