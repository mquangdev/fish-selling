import { STATUS_LABELS, type FishStatus } from "@/lib/fish";

const STATUS_STYLES: Record<FishStatus, string> = {
  available: "bg-emerald-100 text-emerald-800",
  sold_out: "bg-slate-200 text-slate-700",
  coming_soon: "bg-amber-100 text-amber-800",
  hidden: "",
};

export default function StatusBadge({
  status,
  className = "",
}: {
  status: FishStatus;
  className?: string;
}) {
  const label = STATUS_LABELS[status];
  if (!label) return null;
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]} ${className}`}
    >
      {label}
    </span>
  );
}
