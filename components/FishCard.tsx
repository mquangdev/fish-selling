import Image from "next/image";
import Link from "next/link";
import FishPlaceholder from "@/components/FishPlaceholder";
import StatusBadge from "@/components/StatusBadge";
import {
  formatPrice,
  getSizeRange,
  getStartingPrice,
  type Fish,
} from "@/lib/fish";

export default function FishCard({ fish }: { fish: Fish }) {
  const cover = fish.images[0];
  const size = getSizeRange(fish);
  const startingPrice = getStartingPrice(fish);

  return (
    <Link
      href={`/ca/${fish.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ocean-100 bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ocean-50">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            style={cover.position ? { objectPosition: cover.position } : undefined}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FishPlaceholder name={fish.name} />
        )}
        <StatusBadge status={fish.status} className="absolute left-3 top-3" />
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
