import type { Fish } from "@/lib/fish";

export default function OriginSection({
  breeding,
}: {
  breeding: Fish["breeding"];
}) {
  const items = [
    { label: "Nguồn cá", value: breeding.source },
    { label: "Thế hệ", value: breeding.generation },
    { label: "Ghi chú", value: breeding.note },
  ].filter((item): item is { label: string; value: string } => !!item.value);

  return (
    <section>
      <h2 className="text-xl font-bold text-ocean-900">Nguồn gốc</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-ocean-50 p-4">
            <dt className="text-sm text-ocean-700">{item.label}</dt>
            <dd className="mt-1 font-semibold text-ocean-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
