import { siteConfig } from "@/lib/site";

const baseClass =
  "fixed right-4 z-50 bottom-[max(1rem,env(safe-area-inset-bottom))] flex h-14 min-w-14 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold shadow-lg";

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4.5 21l4-2.1c1.1.4 2.3.6 3.5.6 5.5 0 10-3.6 10-8s-4.5-8-10-8z" />
    </svg>
  );
}

export default function ZaloButton() {
  if (!siteConfig.zaloUrl) {
    // Not configured: show a visible notice instead of a broken link.
    return (
      <span
        role="note"
        aria-label="Zalo chưa được cấu hình"
        className={`${baseClass} bg-amber-100 text-amber-900`}
      >
        [CẦN BỔ SUNG] Zalo
      </span>
    );
  }

  return (
    <a
      href={siteConfig.zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nhắn Zalo"
      className={`${baseClass} bg-accent text-white hover:bg-accent-dark`}
    >
      <ChatIcon />
      <span>Nhắn Zalo</span>
    </a>
  );
}
