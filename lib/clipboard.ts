/**
 * Copies text without waiting, for click handlers that must not delay a
 * navigation (for example a link that opens another app in a new tab).
 *
 * The synchronous textarea copy runs first, inside the user gesture, so it works
 * even when the new tab immediately takes focus; the async Clipboard API is also
 * tried as a best effort. Returns whether the synchronous copy succeeded.
 */
export function copyTextNow(text: string): boolean {
  const ok = legacyCopy(text);
  try {
    void navigator.clipboard?.writeText(text).catch(() => {});
  } catch {
    // Ignore: the synchronous copy above is the one we rely on.
  }
  return ok;
}

/** Synchronous copy through a hidden textarea; must run inside a user gesture. */
function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length); // needed on iOS
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}
