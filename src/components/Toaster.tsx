"use client";

import { useStore } from "@/store/StoreProvider";

export default function Toaster() {
  const { toasts, dismissToast } = useStore();
  const color = (t: string) => (t === "error" ? "var(--red)" : t === "info" ? "var(--navy)" : "var(--green)");
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="pointer-events-auto pop flex max-w-[92vw] cursor-pointer items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-lg)]"
          style={{ background: color(t.type) }}
        >
          {t.type === "success" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6L9 17l-5-5"/></svg>
          )}
          {t.type === "error" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M18 6L6 18M6 6l12 12"/></svg>
          )}
          {t.type === "info" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M12 8h.01M11 12h1v4h1"/><circle cx="12" cy="12" r="9"/></svg>
          )}
          {t.msg}
        </div>
      ))}
    </div>
  );
}
