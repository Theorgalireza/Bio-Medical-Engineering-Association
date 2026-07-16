"use client";

import { useEffect, useState } from "react";
import RichEditor from "@/components/admin/RichEditor";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
  adminCreateArticle,
  adminDeleteArticle,
  adminGetArticles,
  adminUpdateArticle,
} from "@/lib/api";
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
  return Number.isFinite(year) && year >= 1900 && year <= 2100
    ? year
    : new Date().getFullYear();
}

export default function ArticlesPage() {
  const [items, setItems] = useState<AdminArticle[]>([]);
  const [modal, setModal] = useState<{
    open: boolean;
    editing: AdminArticle | null;
  }>({
    open: false,
    editing: null,
  });

  const [form, setForm] = useState(empty);
  const [authorsInput, setAuthorsInput] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await adminGetArticles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setForm(empty);
    setAuthorsInput("");
    setModal({
      open: true,
      editing: null,
    });
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

    setModal({
      open: true,
      editing: item,
    });
  };

  const close = () => {
    setModal({
      open: false,
      editing: null,
    });
  };

  const save = async () => {
    if (!form.title) return;

    const authors = authorsInput
      .split(/[،,]/)
      .map((a) => a.trim())
      .filter(Boolean);

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
      if (modal.editing) {
        await adminUpdateArticle(modal.editing.id, payload);
      } else {
        await adminCreateArticle(payload);
      }

      close();
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "ذخیره مقاله ناموفق بود.");
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">مقالات</h2>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#a855f7] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#a855f7]/80 transition-colors"
        >
          <Plus size={16} />
          افزودن
        </button>
      </div>

      <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2d4a] text-gray-400 text-xs font-vazir">
              <th className="text-right px-4 py-3">عنوان</th>
              <th className="text-right px-4 py-3">دسته‌بندی</th>
              <th className="text-right px-4 py-3">سال</th>
              <th className="text-right px-4 py-3">وضعیت</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {!loading &&
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#1e2d4a]/50 hover:bg-white/2 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-200">{item.title}</td>

                  <td className="px-4 py-3 text-gray-400 font-vazir text-xs">
                    {item.category}
                  </td>

                  <td className="px-4 py-3 text-gray-400 font-vazir text-xs">
                    {item.year}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        const next = !item.published;
                        await adminUpdateArticle(item.id, {
                          status: next ? "PUBLISHED" : "DRAFT",
                        });
                        await load();
                      }}
                      className={`px-2 py-0.5 rounded text-xs font-vazir transition-colors ${
                        item.published
                          ? "bg-[#22c55e]/15 text-[#22c55e]"
                          : "bg-gray-500/15 text-gray-400"
                      }`}
                    >
                      {item.published ? "منتشر" : "پیش‌نویس"}
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-gray-400 hover:text-[#a855f7] transition-colors"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={async () => {
                          await adminDeleteArticle(item.id);
                          await load();
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading && <p className="p-4 text-sm text-gray-500">در حال بارگذاری...</p>}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8">
          <div
            className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-6 w-full max-w-2xl space-y-4 mx-4"
            dir="rtl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold">
                {modal.editing ? "ویرایش مقاله" : "مقاله جدید"}
              </h3>

              <button onClick={close} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="عنوان مقاله"
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]/50"
              />

              

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={authorsInput}
                  onChange={(e) => setAuthorsInput(e.target.value)}
                  placeholder="نویسندگان (با ، جدا کنید)"
                  className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]/50"
                />

                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  placeholder="دسته‌بندی"
                  className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]/50"
                />

                <input
                  value={form.year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      year: extractYear(e.target.value),
                    })
                  }
                  placeholder="سال (مثال: ۱۴۰۳)"
                  className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]/50"
                />
              </div>

              <RichEditor
                value={form.content}
                onChange={(content) =>
                  setForm({
                    ...form,
                    content,
                  })
                }
                placeholder="متن مقاله را بنویسید..."
                minHeight="240px"
              />

              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      published: e.target.checked,
                    })
                  }
                  className="accent-[#a855f7]"
                />
                منتشر شود
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={close}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                انصراف
              </button>

              <button
                onClick={save}
                className="flex items-center gap-2 bg-[#a855f7] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#a855f7]/80 transition-colors"
              >
                <Check size={15} />
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
