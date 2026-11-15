import { formatRange, type Fish } from "@/lib/fish";

export default function CareSection({ care }: { care: Fish["care"] }) {
  const items = [
    { label: "Nhiệt độ", value: `${formatRange(care.temperatureC)}°C` },
    { label: "Độ pH", value: formatRange(care.ph) },
    { label: "Kích thước trưởng thành", value: `${care.adultSizeCm} cm` },
    { label: "Bể tối thiểu", value: `${care.minTankLiters} lít` },
    { label: "Tính cách", value: care.temperament },
    { label: "Thức ăn", value: care.diet },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-ocean-900">Thông tin chăm sóc</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-ocean-50 p-4">
            <dt className="text-sm text-ocean-700">{item.label}</dt>
            <dd className="mt-1 font-semibold text-ocean-900">{item.value}</dd>
          </div>
        ))}
      </dl>
      {care.tips.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-ocean-900">Mẹo nuôi</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ocean-800">
            {care.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
