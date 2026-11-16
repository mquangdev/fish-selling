"use client";

import Image from "next/image";
import { useVariantSelection } from "@/components/fish/VariantSelection";
import {
  formatPrice,
  groupVariantsByGrade,
  type FishVariant,
} from "@/lib/fish";

function VariantStatusPill({ status }: { status: FishVariant["status"] }) {
  const inStock = status === "available";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        inStock
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-200 text-slate-700"
      }`}
    >
      {inStock ? "Còn hàng" : "Hết hàng"}
    </span>
  );
}

export default function VariantsList({
  variants,
  gradeNotes,
}: {
  variants: FishVariant[];
  gradeNotes?: Record<string, string>;
}) {
  const { selectedId, select } = useVariantSelection();
  const groups = groupVariantsByGrade(variants);

  return (
    <div>
      <h2 className="text-lg font-bold text-ocean-900">Size và giá</h2>
      {groups.map((group) => (
        <div key={group.grade ?? "all"} className="mt-3">
          {group.grade && (
            <h3 className="text-sm font-semibold text-ocean-700">
              {group.grade}
            </h3>
          )}
          {group.grade && gradeNotes?.[group.grade] && (
            <p className="mt-1 rounded-lg bg-ocean-50 px-3 py-2 text-sm text-ocean-800">
              {gradeNotes[group.grade]}
            </p>
          )}
          <ul className="mt-2 space-y-2">
            {group.variants.map((variant) => {
              const selected = variant.id === selectedId;
              const soldOut = variant.status === "sold_out";
              const thumb = variant.images[0];
              return (
                <li key={variant.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(selected ? null : variant.id)}
                    className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left ${
                      selected
                        ? "border-accent bg-ocean-50"
                        : "border-ocean-100 bg-surface hover:bg-ocean-50"
                    }`}
                  >
                    {thumb ? (
                      <span className="relative h-10 w-12 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={thumb.src}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                    ) : (
                      variant.videos.length > 0 && (
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-12 shrink-0 items-center justify-center rounded-md bg-ocean-100 text-ocean-700"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      )
                    )}
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-medium ${
                          soldOut ? "text-slate-600" : "text-ocean-900"
                        }`}
                      >
                        {variant.label}
                      </span>
                      {variant.sizeCm && (
                        <span className="block text-xs text-ocean-700">
                          {variant.sizeCm} cm
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`font-semibold ${
                          soldOut ? "text-slate-600" : "text-ocean-900"
                        }`}
                      >
                        {formatPrice(variant.price)}
                      </span>
                      <VariantStatusPill status={variant.status} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
