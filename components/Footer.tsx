import Link from "next/link";
import { PLACEHOLDER, SITE_NAME, getPhoneHref, siteConfig } from "@/lib/site";

const linkClass =
  "inline-flex min-h-11 items-center font-medium text-brand-100 underline-offset-4 hover:text-white hover:underline";
const placeholderClass = "inline-flex min-h-11 items-center text-amber-200";

export default function Footer() {
  const phoneHref = getPhoneHref();

  return (
    <footer className="bg-brand-900 pb-20 text-brand-100">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <p className="text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="mt-2 text-sm">
            Cá cảnh nhà nuôi. Nhắn Zalo để biết size, giá và tình trạng cá.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white">Liên hệ</p>
          <ul className="mt-1">
            <li>
              {siteConfig.zaloUrl ? (
                <a
                  href={siteConfig.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Zalo
                </a>
              ) : (
                <span className={placeholderClass}>{PLACEHOLDER} Zalo</span>
              )}
            </li>
            <li>
              {phoneHref && siteConfig.phone ? (
                <a href={phoneHref} className={linkClass}>
                  {siteConfig.phone}
                </a>
              ) : (
                <span className={placeholderClass}>
                  {PLACEHOLDER} Số điện thoại
                </span>
              )}
            </li>
            {siteConfig.socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {social.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/lien-he" className={linkClass}>
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach" className={linkClass}>
                Chính sách
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 px-4 py-4 text-center text-xs">
        © {SITE_NAME}
      </div>
    </footer>
  );
}
