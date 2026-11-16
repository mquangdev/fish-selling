import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu, { type NavLink } from "@/components/MobileMenu";
import { SITE_NAME } from "@/lib/site";

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/chinh-sach", label: "Chính sách" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ocean-100 bg-surface/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 md:justify-between">
        {/* Mobile menu button comes first so it sits on the left; hidden from md up. */}
        <MobileMenu links={NAV_LINKS} />

        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 text-lg font-bold text-ocean-800"
        >
          <Image
            src="/logo.svg"
            alt=""
            width={68}
            height={40}
            priority
            className="h-10 w-auto"
          />
          {SITE_NAME}
        </Link>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <nav aria-label="Menu chính" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 items-center rounded-lg px-3 font-medium text-ocean-900 hover:bg-ocean-50 hover:text-ocean-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
