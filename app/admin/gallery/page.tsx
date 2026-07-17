"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, ImageOff } from "lucide-react";
import {
  adminCreateGallery,
  adminDeleteGallery,
  adminGetGallery,
  adminUpdateGallery,
} from "@/lib/api";
import type { GalleryItem } from "@/types";

const empty: Omit<GalleryItem, "id"> = {
  title: "",
  description: "",
  imageUrl: "",
  category: "",
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState<{
    open: boolean;
    editing: GalleryItem | null;
  }>({ open: false, editing: null });

  const [form, setForm] = useState<Omit<GalleryItem, "id">>(empty);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetGallery();
      setItems(data);
    } catch (e) {
      setError("خطا در دریافت لیست گالری");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(empty);
    setModal({ open: true, editing: null });
  };

  const openEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      description: item.description ?? "",
      imageUrl: item.imageUrl,
      category: item.category ?? "",
    });
    setModal({ open: true, editing: item });
  };

  const closeModal = () => setModal({ open: false, editing: null });

  const handleSave = async () => {
    if (!form.title.trim() || !form.imageUrl.trim()) {
      setError("عنوان و آدرس تصویر الزامی است");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (modal.editing) {
        await adminUpdateGallery(modal.editing.id, form);
      } else {
        await adminCreateGallery(form);
      }
      closeModal();
      await load();
    } catch (e) {
      setError("خطا در ذخیره‌سازی");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این تصویر مطمئن هستید؟")) return;
    try {
      await adminDeleteGallery(id);
      await load();
    } catch (e) {
      setError("خطا در حذف");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">مدیریت گالری تصاویر</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-primary transition hover:opacity-90"
        >
          <Plus size={18} />
          افزودن تصویر
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">در حال بارگذاری...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-borderSoft bg-primaryLight/40 px-6 py-16 text-center text-sm text-gray-400">
          هنوز تصویری ثبت نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight/60"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-primary/60">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    <ImageOff size={28} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white">{item.title}</h3>
                {item.category && (
                  <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                    {item.category}
                  </span>
                )}
                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-gray-400">
                    {item.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1 rounded-lg border border-borderSoft px-3 py-1.5 text-xs text-gray-300 hover:bg-primary/40"
                  >
                    <Pencil size={14} />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-borderSoft bg-primaryLight p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {modal.editing ? "ویرایش تصویر" : "افزودن تصویر جدید"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">عنوان *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-borderSoft bg-primary/60 px-3 py-2 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">آدرس تصویر (URL) *</label>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-borderSoft bg-primary/60 px-3 py-2 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">دسته‌بندی</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-borderSoft bg-primary/60 px-3 py-2 text-sm text-white outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">توضیحات</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-borderSoft bg-primary/60 px-3 py-2 text-sm text-white outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-xl border border-borderSoft px-4 py-2 text-sm text-gray-300 hover:bg-primary/40"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-primary hover:opacity-90 disabled:opacity-50"
              >
                <Check size={16} />
                {saving ? "در حال ذخیره..." : "ذخیره"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
