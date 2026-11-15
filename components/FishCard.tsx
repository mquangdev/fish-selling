import Image from "next/image";
import Link from "next/link";
import FishPlaceholder from "@/components/FishPlaceholder";
import {
  STATUS_LABELS,
  formatPrice,
  getSizeRange,
  getStartingPrice,
  type Fish,
  type FishStatus,
} from "@/lib/fish";

const STATUS_STYLES: Record<FishStatus, string> = {
  available: "bg-emerald-100 text-emerald-800",
  sold_out: "bg-slate-200 text-slate-700",
  coming_soon: "bg-amber-100 text-amber-800",
  hidden: "",
};

export default function FishCard({ fish }: { fish: Fish }) {
  const cover = fish.images[0];
  const size = getSizeRange(fish);
  const startingPrice = getStartingPrice(fish);
  const statusLabel = STATUS_LABELS[fish.status];

  return (
    <Link
      href={`/ca/${fish.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ocean-50">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FishPlaceholder name={fish.name} />
        )}
        {statusLabel && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[fish.status]}`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-ocean-900">{fish.name}</h3>
        <p className="text-sm text-ocean-800">{fish.tagline}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-ocean-700">{size ?? ""}</span>
          <span className="font-semibold text-ocean-900">
            {startingPrice === null
              ? formatPrice(null)
              : `Giá từ ${formatPrice(startingPrice)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
