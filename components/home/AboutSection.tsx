import { SITE_NAME } from "@/lib/site";

const POINTS = [
  {
    title: "Nhà nuôi, tự sinh sản",
    text: "Cá được sinh sản và nuôi ngay tại trại.",
  },
  {
    title: "Quy mô nhỏ, chăm kỹ",
    text: "Nuôi số lượng vừa phải để chăm sóc sát sao.",
  },
  {
    title: "Chất lượng là ưu tiên",
    text: "Cá khỏe khi đến tay bạn là điều mình quan tâm nhất.",
  },
];

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section className="bg-ocean-50">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-ocean-900 md:text-3xl">
          Về trại
        </h2>
        <p className="mt-3 max-w-2xl text-ocean-800">
          {SITE_NAME} là trại cá tại nhà, không phải trại chuyên nghiệp. Mình
          tự sinh sản và nuôi những dòng cá mình thích, nên hiểu rõ từng đàn
          cá. Quy mô nhỏ, nhưng mình luôn đặt chất lượng cá khi đến tay bạn lên
          hàng đầu.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {POINTS.map((point) => (
            <li
              key={point.title}
              className="rounded-2xl bg-surface p-5 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-100 text-ocean-700">
                <CheckIcon />
              </span>
              <h3 className="mt-3 font-bold text-ocean-900">{point.title}</h3>
              <p className="mt-1 text-sm text-ocean-800">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
