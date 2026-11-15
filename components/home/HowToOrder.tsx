const STEPS = [
  { title: "Chọn cá", text: "Xem dòng cá bạn thích ở trên." },
  { title: "Nhắn Zalo", text: "Hỏi size, giá và tình trạng cá." },
  { title: "Chốt đơn", text: "Thống nhất cách nhận cá với mình." },
];

export default function HowToOrder() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-bold text-ocean-900 md:text-3xl">
        Đặt cá thế nào?
      </h2>
      <ol className="mt-8 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean-700 font-bold text-white">
              {index + 1}
            </span>
            <div>
              <h3 className="font-bold text-ocean-900">{step.title}</h3>
              <p className="mt-1 text-sm text-ocean-800">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
