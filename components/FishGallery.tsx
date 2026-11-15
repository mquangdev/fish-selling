"use client";

import Image from "next/image";
import { useState } from "react";
import FishPlaceholder from "@/components/FishPlaceholder";
import { useVariantSelection } from "@/components/fish/VariantSelection";
import type { FishImage, FishVariant } from "@/lib/fish";

function GalleryView({
  images,
  name,
}: {
  images: FishImage[];
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const current = images[index];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ocean-50">
        {current ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={index === 0}
            className="object-cover"
          />
        ) : (
          <FishPlaceholder name={name} />
        )}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                className={`relative block h-16 w-20 overflow-hidden rounded-lg border-2 ${
                  i === index ? "border-accent" : "border-transparent"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Shows the selected variant's photos when it has any; otherwise the fish's
 * general photos (or a placeholder when there are none).
 */
export default function FishGallery({
  images,
  variants,
  name,
}: {
  images: FishImage[];
  variants: FishVariant[];
  name: string;
}) {
  const { selectedId } = useVariantSelection();
  const selected = variants.find((variant) => variant.id === selectedId);
  const shown = selected && selected.images.length > 0 ? selected.images : images;

  // Remount when the shown set changes so the main image resets to the first one.
  return (
    <GalleryView
      key={selected && selected.images.length > 0 ? selected.id : "general"}
      images={shown}
      name={name}
    />
  );
}
