import StatusBadge from "@/components/StatusBadge";
import ZaloCta from "@/components/ZaloCta";
import { ZALO_LABELS, type Fish } from "@/lib/fish";

/** Fixed bottom bar on the fish detail page. Replaces the global floating button there. */
export default function ZaloStickyBar({ fish }: { fish: Fish }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ocean-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <div className="hidden min-w-0 flex-1 items-center gap-3 sm:flex">
          <span className="truncate font-bold text-ocean-900">{fish.name}</span>
          <StatusBadge status={fish.status} />
        </div>
        <ZaloCta
          label={ZALO_LABELS[fish.status]}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
