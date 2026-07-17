"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Star, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { adminDeleteFeedback, adminGetFeedback, adminUpdateFeedback } from "@/lib/api";
import { filterBySearch, paginate, selectAllVisible, toggleSelection } from "@/lib/admin-table";
import type { AdminFeedback } from "@/types";
import { useAuth } from "@/context/AuthContext";

const PAGE_SIZE = 8;

export default function FeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const canManage = user?.role === "OWNER" || user?.role === "ADMIN";
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminGetFeedback();
      setItems(data);
      setSelectedIds(new Set());
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!canManage) {
      setLoading(false);
      return;
    }

    load().catch(() => setLoading(false));
  }, [authLoading, canManage]);

  const filtered = useMemo(
    () => filterBySearch(items, query, (item) => [item.name, item.message, item.date, item.rating]),
    [items, query],
  );
  const { slice: visible, totalPages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);
  const allVisibleSelected = visible.length > 0 && visible.every((item) => selectedIds.has(item.id));


  const bulkToggleApproved = async (approved: boolean) => {
    const targets = items.filter((item) => selectedIds.has(item.id));
    if (!targets.length) return;
    await Promise.all(targets.map((item) => adminUpdateFeedback(item.id, { approved })));
    await load();
  };

  const bulkDelete = async () => {
    const targets = items.filter((item) => selectedIds.has(item.id));
    if (!targets.length) return;
    if (!confirm(`حذف ${targets.length} بازخورد انجام شود؟`)) return;
    await Promise.all(targets.map((item) => adminDeleteFeedback(item.id)));
    await load();
  };

  if (authLoading) return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/50">در حال بارگذاری...</div>;
  if (!canManage) {
    return <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">این بخش فقط برای مدیران سیستم در دسترس است.</div>;
  }

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">بازخوردها</h2>
          <p className="mt-1 text-sm text-white/40">{items.length.toLocaleString("fa-IR")} بازخورد ذخیره شده است.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.size > 0 && (
            <>
              <button onClick={() => bulkToggleApproved(true)} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">تأیید گروهی</button>
              <button onClick={() => bulkToggleApproved(false)} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">لغو تأیید</button>
              <button onClick={bulkDelete} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">حذف انتخاب‌شده‌ها</button>
            </>
          )}
          <button onClick={load} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10">تازه‌سازی</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex items-center gap-2 rounded-full border border-[#1e2d4a] bg-[#0d1526] px-4 py-2 text-sm text-gray-300 lg:w-[28rem]">
          <Search size={15} className="shrink-0 text-gray-500" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="جستجو در نام، متن یا تاریخ..." className="w-full bg-transparent outline-none placeholder:text-gray-500" />
        </label>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => setSelectedIds((prev) => selectAllVisible(prev, visible.map((item) => item.id)))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10">{allVisibleSelected ? "لغو انتخاب صفحه" : "انتخاب صفحه"}</button>
          <span>انتخاب‌شده: {selectedIds.size.toLocaleString("fa-IR")}</span>
        </div>
      </div>

      <div className="space-y-3">
        {!loading && visible.map(item => (
          <div key={item.id} className="rounded-xl border border-[#1e2d4a] bg-[#0d1526] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => setSelectedIds((prev) => toggleSelection(prev, item.id))} className="mt-1 accent-[#f59e0b]" />
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span className="font-medium text-gray-200">{item.name}</span>
                    <span className="font-vazir text-xs text-gray-500">{item.date}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < item.rating ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-600"} />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{item.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={async () => { await adminUpdateFeedback(item.id, { approved: !item.approved }); await load(); }} className={`rounded px-2 py-0.5 text-xs font-vazir transition-colors ${item.approved ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-gray-500/15 text-gray-400"}`}>{item.approved ? "تأیید شده" : "در انتظار"}</button>
                <button onClick={async () => { if (!confirm("این بازخورد حذف شود؟")) return; await adminDeleteFeedback(item.id); await load(); }} className="text-gray-400 transition-colors hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500">در حال بارگذاری...</p>}
        {!loading && visible.length === 0 && <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-gray-500">موردی یافت نشد</p>}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
          <button disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={15} /> قبلی</button>
          <span>صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">بعدی <ChevronLeft size={15} /></button>
        </div>
      )}
    </div>
  );
}
