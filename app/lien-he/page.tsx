import type { Metadata } from "next";
import type { ReactNode } from "react";
import ZaloCta from "@/components/ZaloCta";
import {
  PLACEHOLDER,
  SITE_NAME,
  getPhoneHref,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `Liên hệ | ${SITE_NAME}`,
  description:
    "Liên hệ qua Zalo, điện thoại hoặc mạng xã hội để hỏi cá, biết size và giá.",
};

const cardClass =
  "flex min-h-14 items-center justify-between gap-3 rounded-xl border border-ocean-100 bg-white px-4 py-3 font-semibold text-ocean-900 shadow-sm hover:bg-ocean-50";

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li>
      <p className="text-sm text-ocean-700">{label}</p>
      {children}
    </li>
  );
}

export default function ContactPage() {
  const phoneHref = getPhoneHref();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-ocean-900 md:text-4xl">Liên hệ</h1>
      <p className="mt-3 text-ocean-800">
        Cách nhanh nhất để hỏi cá, biết size, giá và chốt đơn là nhắn Zalo.
      </p>

      <div className="mt-6">
        <ZaloCta className="w-full sm:w-auto" />
      </div>

      <ul className="mt-10 space-y-5">
        <ContactRow label="Điện thoại">
          {phoneHref && siteConfig.phone ? (
            <a href={phoneHref} className={cardClass}>
              <span>{siteConfig.phone}</span>
              <span className="text-sm font-medium text-ocean-700">Gọi</span>
            </a>
          ) : (
            <p className="rounded-lg bg-amber-100 px-3 py-2 text-amber-900">
              {PLACEHOLDER} Số điện thoại
            </p>
          )}
        </ContactRow>

        {siteConfig.socials.map((social) => (
          <ContactRow key={social.id} label={social.label}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
            >
              <span>{social.label}</span>
              <span className="text-sm font-medium text-ocean-700">Mở</span>
            </a>
          </ContactRow>
        ))}

        {siteConfig.address && (
          <ContactRow label="Địa chỉ">
            <p className="font-medium text-ocean-900">{siteConfig.address}</p>
          </ContactRow>
        )}

        {siteConfig.replyHours && (
          <ContactRow label="Giờ trả lời tin nhắn">
            <p className="font-medium text-ocean-900">
              {siteConfig.replyHours}
            </p>
          </ContactRow>
        )}
      </ul>

      {siteConfig.pickupNote && (
        <p className="mt-8 rounded-xl bg-ocean-50 p-4 text-sm text-ocean-800">
          {siteConfig.pickupNote}
        </p>
      )}
    </div>
  );
}
