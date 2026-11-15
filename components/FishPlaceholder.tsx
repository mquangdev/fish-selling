/** Neutral image placeholder shown until a fish has real photos. */
export default function FishPlaceholder({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`Chưa có ảnh ${name}`}
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-ocean-100 via-ocean-200 to-ocean-300 text-ocean-700"
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4 32c8-12 20-18 32-14 4 1 8 4 10 8l12-9v30l-12-9c-2 4-6 7-10 8C24 50 12 44 4 32zm14-4a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
      <span className="px-4 text-center text-sm font-medium">{name}</span>
    </div>
  );
}
