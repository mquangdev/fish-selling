import ZaloCta from "@/components/ZaloCta";
import { buildPageMetadata } from "@/lib/seo";
import { PLACEHOLDER, SITE_NAME, siteData } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: `Chính sách | ${SITE_NAME}`,
  description:
    "Chính sách vận chuyển, đóng gói, bảo hành chết cá, thanh toán và đổi trả.",
  path: "/chinh-sach",
});

export default function PolicyPage() {
  const { intro, sections } = siteData.policy;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-ocean-900 md:text-4xl">
        Chính sách
      </h1>
      {intro && <p className="mt-3 text-ocean-800">{intro}</p>}

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xl font-bold text-ocean-900">
              {section.title}
            </h2>
            <div className="mt-2 space-y-2 text-ocean-800">
              {section.body ? (
                section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))
              ) : (
                <p className="rounded-lg bg-amber-100 px-3 py-2 text-amber-900">
                  {PLACEHOLDER} Nội dung mục này
                </p>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-ocean-50 p-6 text-center">
        <p className="font-semibold text-ocean-900">Còn điều gì chưa rõ?</p>
        <p className="mt-1 text-sm text-ocean-800">
          Nhắn Zalo, mình trả lời bạn sớm nhất có thể.
        </p>
        <ZaloCta className="mt-4 w-full sm:w-auto" />
      </div>
    </div>
  );
}
