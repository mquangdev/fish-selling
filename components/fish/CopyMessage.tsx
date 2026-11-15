"use client";

import { useState } from "react";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // The Clipboard API is unavailable on non-HTTPS pages (e.g. LAN dev); fall back.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  }
}

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
