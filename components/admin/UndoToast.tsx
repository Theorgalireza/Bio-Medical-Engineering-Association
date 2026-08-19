"use client";

import { RotateCcw, X } from "lucide-react";

export default function UndoToast({
  count,
  onUndo,
  onDismiss,
  busy = false,
}: {
  count: number;
  onUndo: () => void;
  onDismiss: () => void;
  busy?: boolean;
}) {
  if (!count) return null;
  return (
    <div className="fixed bottom-5 left-5 z-[70] flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-[#0d1526] px-4 py-3 text-sm text-white shadow-2xl">
      <span>{count.toLocaleString("fa-IR")} مورد حذف شد.</span>
      <button type="button" onClick={onUndo} disabled={busy} className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/15 px-3 py-1.5 text-cyan-300 hover:bg-cyan-500/25 disabled:opacity-50">
        <RotateCcw size={14} /> {busy ? "در حال بازگردانی..." : "بازگردانی"}
      </button>
      <button type="button" onClick={onDismiss} aria-label="بستن پیام بازگردانی" className="text-white/50 hover:text-white"><X size={15} /></button>
    </div>
  );
}
