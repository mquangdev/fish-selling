"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";

export default function CopyMessage({ message }: { message: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    const ok = await copyText(message);
    setState(ok ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="rounded-xl bg-ocean-50 p-4">
      <p className="text-sm font-semibold text-ocean-900">Tin nhắn mẫu</p>
      <p className="mt-1 text-sm text-ocean-800">{message}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 items-center rounded-full border border-ocean-300 bg-white px-5 text-sm font-semibold text-ocean-800 hover:bg-ocean-100"
        >
          Sao chép
        </button>
        <span role="status" className="text-sm text-ocean-700">
          {state === "copied" && "Đã sao chép"}
          {state === "failed" && "Không sao chép được, hãy chọn chữ để chép tay"}
        </span>
      </div>
    </div>
  );
}
