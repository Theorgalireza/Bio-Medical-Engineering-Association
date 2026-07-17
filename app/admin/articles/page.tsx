"use client";

import { useEffect, useMemo, useState } from "react";
import RichEditor from "@/components/admin/RichEditor";
import { Plus, Pencil, Trash2, X, Check, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  adminCreateArticle,
  adminDeleteArticle,
  adminGetArticles,
  adminUpdateArticle,
} from "@/lib/api";
import { filterBySearch, paginate, selectAllVisible, toggleSelection } from "@/lib/admin-table";
import type { AdminArticle } from "@/types";

const empty: Omit<AdminArticle, "id"> = {
  title: "",
  summary: "",
  authors: [],
  category: "",
  year: new Date().getFullYear(),
  content: "",
  published: false,
};

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

function extractYear(value: string) {
  const ascii = normalizeDigits(value);
  const match = ascii.match(/\d{4}/);
  const year = match ? Number(match[0]) : NaN;
  return Number.isFinite(year) && year >= 1900 && year <= 2100 ? year : new Date().getFullYear();
}

const PAGE_SIZE = 6;

export default function ArticlesPage() {
  const [items, setItems] = useState<AdminArticle[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: AdminArticle | null }>({ open: false, editing: null });
  const [form, setForm] = useState(empty);
  const [authorsInput, setAuthorsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = async () => {
    try {
      setLoading(true);
      setItems(await adminGetArticles());
      setSelectedIds(new Set());
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterBySearch(items, query, (item) => [item.title, item.summary, item.category, item.year, item.authors.join(" "), item.content]),
    [items, query],
  );

  const { slice: visible, totalPages, page: currentPage } = paginate(filtered, page, PAGE_SIZE);


  const openAdd = () => {
    setForm(empty);
    setAuthorsInput("");
    setModal({ open: true, editing: null });
  };

  const openEdit = (item: AdminArticle) => {
    setForm({
      title: item.title,
      summary: item.summary,
      authors: item.authors,
      category: item.category,
      year: item.year,
      content: item.content,
      published: item.published,
    });
    setAuthorsInput(item.authors.join("، "));
    setModal({ open: true, editing: item });
  };

  const close = () => setModal({ open: false, editing: null });

  const save = async () => {
    if (!form.title.trim()) return;

    const authors = authorsInput.split(/[،,]/).map((a) => a.trim()).filter(Boolean);
    const payload = {
      title: form.title,
      summary: form.summary,
      authors,
      category: form.category,
      year: form.year,
      content: form.content,
      status: form.published ? "PUBLISHED" : "DRAFT",
    };

    try {
      if (modal.editing) await adminUpdateArticle(modal.editing.id, payload);
      else await adminCreateArticle(payload);
      close();
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "ذخیره مقاله ناموفق بود.");
    }
  };

  const bulkDelete = async () => {
    const targets = items.filter((item) => selectedIds.has(item.id));
    if (!targets.length) return;
    if (!confirm(`حذف ${targets.length} مقاله انجام شود؟`)) return;
    await Promise.all(targets.map((item) => adminDeleteArticle(item.id)));
    await load();
  };

  const bulkSetPublished = async (published: boolean) => {
    const targets = items.filter((item) => selectedIds.has(item.id));
    if (!targets.length) return;
    await Promise.all(
      targets.map((item) => adminUpdateArticle(item.id, { status: published ? "PUBLISHED" : "DRAFT" })),
    );
    await load();
  };

  const selectedCount = selectedIds.size;
  const allVisibleSelected = visible.length > 0 && visible.every((item) => selectedIds.has(item.id));

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">مقالات</h2>
          <p className="mt-1 text-sm text-white/40">{items.length.toLocaleString("fa-IR")} رکورد ثبت شده است.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedCount > 0 && (
            <>
              <button onClick={() => bulkSetPublished(true)} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">انتشار گروهی</button>
              <button onClick={() => bulkSetPublished(false)} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">لغو انتشار</button>
              <button onClick={bulkDelete} className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">حذف انتخاب‌شده‌ها</button>
            </>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#a855f7] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a855f7]/80"
          >
            <Plus size={16} />
            افزودن
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex items-center gap-2 rounded-full border border-[#1e2d4a] bg-[#0d1526] px-4 py-2 text-sm text-gray-300 lg:w-[28rem]">
          <Search size={15} className="shrink-0 text-gray-500" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="جستجو در عنوان، دسته‌بندی، نویسندگان یا متن..." className="w-full bg-transparent outline-none placeholder:text-gray-500" />
        </label>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <button
            onClick={() => setSelectedIds((prev) => selectAllVisible(prev, visible.map((item) => item.id)))}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
          >
            {allVisibleSelected ? "لغو انتخاب صفحه" : "انتخاب صفحه"}
          </button>
          <span>انتخاب‌شده: {selectedCount.toLocaleString("fa-IR")}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#1e2d4a] bg-[#0d1526]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2d4a] text-xs font-vazir text-gray-400">
              <th className="px-3 py-3 text-center">
                <input type="checkbox" checked={allVisibleSelected} onChange={() => setSelectedIds((prev) => selectAllVisible(prev, visible.map((item) => item.id)))} className="accent-[#a855f7]" />
              </th>
              <th className="px-4 py-3 text-right">عنوان</th>
              <th className="px-4 py-3 text-right">دسته‌بندی</th>
              <th className="px-4 py-3 text-right">سال</th>
              <th className="px-4 py-3 text-right">وضعیت</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {!loading && visible.map((item) => (
              <tr key={item.id} className="border-b border-[#1e2d4a]/50 transition-colors hover:bg-white/2">
                <td className="px-3 py-3 text-center">
                  <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => setSelectedIds((prev) => toggleSelection(prev, item.id))} className="accent-[#a855f7]" />
                </td>
                <td className="px-4 py-3 text-gray-200">{item.title}</td>
                <td className="px-4 py-3 text-xs font-vazir text-gray-400">{item.category}</td>
                <td className="px-4 py-3 text-xs font-vazir text-gray-400">{item.year}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={async () => {
                      await adminUpdateArticle(item.id, { status: item.published ? "DRAFT" : "PUBLISHED" });
                      await load();
                    }}
                    className={`rounded px-2 py-0.5 text-xs font-vazir transition-colors ${item.published ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-gray-500/15 text-gray-400"}`}
                  >
                    {item.published ? "منتشر" : "پیش‌نویس"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="text-gray-400 transition-colors hover:text-[#a855f7]"><Pencil size={15} /></button>
                    <button onClick={async () => { if (!confirm("این مقاله حذف شود؟")) return; await adminDeleteArticle(item.id); await load(); }} className="text-gray-400 transition-colors hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-4 text-sm text-gray-500">در حال بارگذاری...</p>}
        {!loading && visible.length === 0 && <p className="p-4 text-sm text-gray-500">موردی یافت نشد.</p>}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
          <button disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={15} /> قبلی</button>
          <span>صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">بعدی <ChevronLeft size={15} /></button>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-2xl space-y-4 rounded-xl border border-[#1e2d4a] bg-[#0d1526] p-6" dir="rtl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{modal.editing ? "ویرایش مقاله" : "مقاله جدید"}</h3>
              <button onClick={close} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان مقاله" className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#a855f7]/50" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input value={authorsInput} onChange={(e) => setAuthorsInput(e.target.value)} placeholder="نویسندگان (با ، جدا کنید)" className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#a855f7]/50" />
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="دسته‌بندی" className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#a855f7]/50" />
                <input value={form.year} onChange={(e) => setForm({ ...form, year: extractYear(e.target.value) })} placeholder="سال (مثال: ۱۴۰۳)" className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#a855f7]/50" />
              </div>

              <RichEditor value={form.content} onChange={(content) => setForm({ ...form, content })} placeholder="متن مقاله را بنویسید..." minHeight="240px" />

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#a855f7]" />
                منتشر شود
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={close} className="px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white">انصراف</button>
              <button onClick={save} className="flex items-center gap-2 rounded-lg bg-[#a855f7] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a855f7]/80"><Check size={15} /> ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
