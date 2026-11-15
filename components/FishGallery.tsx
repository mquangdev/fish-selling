"use client";

import Image from "next/image";
import { useState } from "react";
import FishPlaceholder from "@/components/FishPlaceholder";
import { useVariantSelection } from "@/components/fish/VariantSelection";
import type { FishImage, FishVariant, FishVideo } from "@/lib/fish";

type Media =
  | ({ kind: "image" } & FishImage)
  | ({ kind: "video" } & FishVideo);

function toMedia(images: FishImage[], videos: FishVideo[]): Media[] {
  return [
    ...images.map((image) => ({ kind: "image" as const, ...image })),
    ...videos.map((video) => ({ kind: "video" as const, ...video })),
  ];
}

function PlayIcon() {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="true"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

function GalleryView({ media, name }: { media: Media[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = media[index];

  return (
    <div>
      {current?.kind === "video" ? (
        <div className="rounded-2xl bg-ocean-50 px-2 py-3">
          <div className="flex justify-center">
            <video
              key={current.src}
              src={current.src}
              poster={current.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={current.title}
              className="aspect-[9/16] h-[min(70vh,640px)] max-w-full rounded-xl bg-black object-contain"
            />
          </div>
          <p className="mt-2 text-center text-sm font-medium text-ocean-800">
            {current.title}
          </p>
        </div>
      ) : (
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
      )}

      {media.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <li key={item.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={
                  item.kind === "video"
                    ? `Xem video: ${item.title}`
                    : `Xem ảnh ${i + 1}`
                }
                aria-current={i === index}
                className={`relative block h-16 w-20 overflow-hidden rounded-lg border-2 ${
                  i === index ? "border-accent" : "border-transparent"
                }`}
              >
                {item.kind === "video" ? (
                  <>
                    <video
                      src={`${item.src}#t=0.1`}
                      poster={item.poster}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="pointer-events-none absolute inset-0 h-full w-full bg-black object-cover"
                    />
                    <PlayIcon />
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Shows the selected variant's photos and videos when it has any; otherwise
 * the fish's general media (or a placeholder when there is none).
 */
export default function FishGallery({
  images,
  videos,
  variants,
  name,
}: {
  images: FishImage[];
  videos: FishVideo[];
  variants: FishVariant[];
  name: string;
}) {
  const { selectedId } = useVariantSelection();
  const selected = variants.find((variant) => variant.id === selectedId);
  const hasOwnMedia =
    !!selected && selected.images.length + selected.videos.length > 0;
  const media = hasOwnMedia
    ? toMedia(selected.images, selected.videos)
    : toMedia(images, videos);

  // Remount when the shown set changes so the main item resets to the first one.
  return (
    <GalleryView
      key={hasOwnMedia ? selected.id : "general"}
      media={media}
      name={name}
    />
  );
}
