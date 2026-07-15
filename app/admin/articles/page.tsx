"use client";
import { useEffect, useState } from "react";
import RichEditor from "@/components/admin/RichEditor";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { adminCreateArticle, adminDeleteArticle, adminGetArticles, adminUpdateArticle } from "@/lib/api";
import type { AdminArticle } from "@/types";

const empty = {
  title: "",
  summary: "",
  authors: [] as string[],
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
  return Number.isFinite(year) && year >= 1900 && year <= 2100
    ? year
    : new Date().getFullYear();
}

export default function ArticlesPage() {
  const [items, setItems] = useState<AdminArticle[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: AdminArticle | null }>({ open: false, editing: null });
  const [form, setForm] = useState(empty);
  const [authorsStr, setAuthorsStr] = useState("");
  const [yearStr, setYearStr] = useState(String(new Date().getFullYear()));
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await adminGetArticles();
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(empty);
    setAuthorsStr("");
    setYearStr(String(new Date().getFullYear()));
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
    setAuthorsStr(item.authors.join(", "));
    setYearStr(String(item.year));
    setModal({ open: true, editing: item });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      category: form.category,
      authors: authorsStr.split(",").map((s) => s.trim()).filter(Boolean),
      year: extractYear(yearStr),
      status: form.published ? "PUBLISHED" : "DRAFT",
    };
    try {
      if (modal.editing) {
        await adminUpdateArticle(modal.editing.id, payload);
      } else {
        await adminCreateArticle(payload);
      }
      await load();
      setModal({ open: false, editing: null });
    } catch (error) {
      alert(error instanceof Error ? error.message : "ذخیره مقاله ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف شود؟")) return;
    await adminDeleteArticle(id);
    await load();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">مقالات</h1>
        <button onClick={openCreate} className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded">
          <Plus size={16} /> جدید
        </button>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-right p-2">عنوان</th>
            <th className="text-right p-2">دسته‌بندی</th>
            <th className="text-right p-2">سال</th>
            <th className="text-right p-2">وضعیت</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-white/5">
              <td className="p-2">{item.title}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.year}</td>
              <td className="p-2">{item.published ? "منتشر" : "پیش‌نویس"}</td>
              <td className="p-2 flex gap-2 justify-end">
                <button onClick={() => openEdit(item)}><Pencil size={15} /></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 size={15} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-bold">{modal.editing ? "ویرایش مقاله" : "مقاله جدید"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })}><X size={18} /></button>
            </div>

            <input
              className="w-full bg-white/10 rounded px-3 py-2"
              placeholder="عنوان"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full bg-white/10 rounded px-3 py-2 h-20 resize-none"
              placeholder="خلاصه (summary)"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
            <input
              className="w-full bg-white/10 rounded px-3 py-2"
              placeholder="نویسندگان (با کاما جدا کنید)"
              value={authorsStr}
              onChange={(e) => setAuthorsStr(e.target.value)}
            />
            <input
              className="w-full bg-white/10 rounded px-3 py-2"
              placeholder="دسته‌بندی"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              className="w-full bg-white/10 rounded px-3 py-2"
              placeholder="سال (مثلاً ۱۴۰۳ یا 2024)"
              value={yearStr}
              onChange={(e) => setYearStr(e.target.value)}
            />
            <RichEditor value={form.content} onChange={(v) => setForm({ ...form, content: v })} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              انتشار فوری
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              <Check size={16} /> {loading ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
