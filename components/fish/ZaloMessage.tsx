"use client";

import { useState } from "react";
import { copyTextNow } from "@/lib/clipboard";
import { PLACEHOLDER, siteConfig } from "@/lib/site";

/**
 * Sample message for the shop. Zalo personal links cannot prefill a chat, so one
 * tap copies the message and opens the Zalo chat; the customer then pastes it.
 */
export default function ZaloMessage({ message }: { message: string }) {
  const [copyFailed, setCopyFailed] = useState(false);
  const zaloUrl = siteConfig.zaloUrl;

  function handleClick() {
    // No preventDefault: the link must still open even if copying fails.
    setCopyFailed(!copyTextNow(message));
  }

  return (
    <div className="rounded-xl bg-ocean-50 p-4">
      <p className="text-sm font-semibold text-ocean-900">Tin nhắn mẫu</p>
      <p className="mt-1 text-sm text-ocean-800">{message}</p>

      {zaloUrl ? (
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-dark sm:w-auto"
        >
          Sao chép tin nhắn và mở Zalo
        </a>
      ) : (
        <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-900">
          {PLACEHOLDER} Zalo
        </p>
      )}

      <p role="status" className="mt-2 text-xs text-ocean-700">
        {copyFailed
          ? "Chưa sao chép được tin nhắn, bạn hãy chọn chữ ở trên để chép tay."
          : "Tin nhắn được sao chép sẵn khi bấm. Trong Zalo, giữ ô soạn tin, chọn Dán rồi gửi."}
      </p>
    </div>
  );
}
