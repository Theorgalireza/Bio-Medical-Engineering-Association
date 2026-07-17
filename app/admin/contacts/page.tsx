"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, Mail, MailOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { adminDeleteContact, adminGetContacts, adminMarkContactRead } from "@/lib/api";
import { filterBySearch, paginate, selectAllVisible, toggleSelection } from "@/lib/admin-table";
import type { AdminContact } from "@/types";
import { useAuth } from "@/context/AuthContext";

const PAGE_SIZE = 8;

export default function ContactsPage() {
  const { user, loading: authLoading } = useAuth();
  const canManage = user?.role === "OWNER" || user?.role === "ADMIN";
  const [items, setItems] = useState<AdminContact[]>([]);
  const [selected, setSelected] = useState<AdminContact | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminGetContacts();
      setItems(data);
      setSelectedIds(new Set());
      setPage(1);
      if (selected && !data.some((item) => item.id === selected.id)) {
        setSelected(null);
      }
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
    () => filterBySearch(items, query, (item) => [item.name, item.email, item.subject, item.message, item.date]),
    [items, query],
  );
  const { slice: visible, totalPages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);
  const allVisibleSelected = visible.length > 0 && visible.every((item) => selectedIds.has(item.id));


  const markRead = async (id: string) => {
    await adminMarkContactRead(id);
    await load();
  };

  const bulkMarkRead = async () => {
    const targets = items.filter((item) => selectedIds.has(item.id) && !item.read);
    if (!targets.length) return;
    await Promise.all(targets.map((item) => adminMarkContactRead(item.id)));
    await load();
  };

  const bulkDelete = async () => {
    const targets = items.filter((item) => selectedIds.has(item.id));
    if (!targets.length) return;
    if (!confirm(`حذف ${targets.length} پیام تماس انجام شود؟`)) return;
    await Promise.all(targets.map((item) => adminDeleteContact(item.id)));
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
          <h2 className="text-xl font-bold">پیام‌های تماس</h2>
          <p className="mt-1 text-sm text-white/40">{items.length.toLocaleString("fa-IR")} پیام ذخیره شده است.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedIds.size > 0 && (
            <>
              <button onClick={bulkMarkRead} className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-300">علامت‌گذاری خوانده‌شده</button>
              <button onClick={bulkDelete} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">حذف انتخاب‌شده‌ها</button>
            </>
          )}
          <button onClick={load} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:bg-white/10">تازه‌سازی</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex items-center gap-2 rounded-full border border-[#1e2d4a] bg-[#0d1526] px-4 py-2 text-sm text-gray-300 lg:w-[28rem]">
          <Search size={15} className="shrink-0 text-gray-500" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="جستجو در نام، ایمیل، موضوع، متن یا تاریخ..." className="w-full bg-transparent outline-none placeholder:text-gray-500" />
        </label>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button onClick={() => setSelectedIds((prev) => selectAllVisible(prev, visible.map((item) => item.id)))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10">{allVisibleSelected ? "لغو انتخاب صفحه" : "انتخاب صفحه"}</button>
          <span>انتخاب‌شده: {selectedIds.size.toLocaleString("fa-IR")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {!loading && visible.map(item => (
            <button
              key={item.id}
              onClick={async () => { setSelected(item); if (!item.read) await markRead(item.id); }}
              className={`w-full rounded-xl border bg-[#0d1526] p-4 text-right transition-colors hover:border-[#00d4ff]/30 ${selected?.id === item.id ? "border-[#00d4ff]/40" : "border-[#1e2d4a]"}`}
            >
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => setSelectedIds((prev) => toggleSelection(prev, item.id))} className="mt-1 accent-[#00d4ff]" onClick={(e) => e.stopPropagation()} />
                <div className="mt-0.5 shrink-0">{item.read ? <MailOpen size={16} className="text-gray-500" /> : <Mail size={16} className="text-[#00d4ff]" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${item.read ? "text-gray-400" : "text-gray-200"}`}>{item.name}</span>
                    <span className="shrink-0 font-vazir text-xs text-gray-500">{item.date}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{item.subject}</p>
                </div>
              </div>
            </button>
          ))}
          {loading && <p className="p-4 text-sm text-gray-500">در حال بارگذاری...</p>}
          {!loading && visible.length === 0 && <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-gray-500">پیامی یافت نشد</p>}
        </div>

        {selected ? (
          <div className="space-y-4 rounded-xl border border-[#1e2d4a] bg-[#0d1526] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-200">{selected.subject}</h3>
                <p className="mt-1 font-vazir text-xs text-gray-500">{selected.name} — {selected.email}</p>
              </div>
              <button onClick={async () => { await adminDeleteContact(selected.id); setSelected(null); await load(); }} className="text-gray-400 transition-colors hover:text-red-400"><Trash2 size={15} /></button>
            </div>
            <p className="border-t border-[#1e2d4a] pt-4 text-sm leading-relaxed text-gray-300">{selected.message}</p>
            <p className="font-vazir text-xs text-gray-500">{selected.date}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-xl border border-[#1e2d4a] bg-[#0d1526] p-5 text-sm text-gray-500">یک پیام انتخاب کنید</div>
        )}
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
