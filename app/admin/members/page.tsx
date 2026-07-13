"use client";

import { useState } from "react";
import { mockMembers, type AdminMember } from "@/data/mockData";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const empty: Omit<AdminMember, "id"> = {
  name: "",
  studentId: "",
  major: "",
  entryYear: new Date().getFullYear(), // مثلا 2026، اگر تقویم شمسی می‌خوای بعداً تغییرش می‌دیم
  role: "",
  email: "",
  phone: "",
  status: "active",
};

export default function MembersPage() {
  const [items, setItems] = useState<AdminMember[]>(mockMembers);
  const [modal, setModal] = useState<{
    open: boolean;
    editing: AdminMember | null;
  }>({ open: false, editing: null });
  const [form, setForm] = useState(empty);

  const openAdd = () => {
    setForm(empty);
    setModal({ open: true, editing: null });
  };

  const openEdit = (item: AdminMember) => {
    setForm({
      name: item.name,
      studentId: item.studentId,
      major: item.major,
      entryYear: item.entryYear,
      role: item.role,
      email: item.email,
      phone: item.phone ?? "",
      status: item.status,
    });
    setModal({ open: true, editing: item });
  };

  const close = () => setModal({ open: false, editing: null });

  const save = () => {
    if (!form.name || !form.studentId || !form.email) return;

    if (modal.editing) {
      // ویرایش
      setItems((prev) =>
        prev.map((item) =>
          item.id === modal.editing!.id
            ? { ...modal.editing!, ...form }
            : item
        )
      );
    } else {
      // افزودن
      const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      setItems((prev) => [...prev, { id: nextId, ...form }]);
    }

    close();
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold font-vazir">
            مدیریت اعضای انجمن
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-vazir">
            افزودن، ویرایش و مدیریت اعضای انجمن مهندسی پزشکی.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#00d4ff] text-[#0a0f1e] text-xs font-vazir font-semibold hover:bg-[#22e0ff] transition-colors"
        >
          <Plus size={16} />
          <span>افزودن عضو جدید</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <table className="w-full text-right text-xs font-vazir">
          <thead className="bg-[#0f192b] text-gray-300">
            <tr>
              <th className="px-4 py-3">نام</th>
              <th className="px-4 py-3">شماره دانشجویی</th>
              <th className="px-4 py-3">رشته/گرایش</th>
              <th className="px-4 py-3">سال ورود</th>
              <th className="px-4 py-3">نقش</th>
              <th className="px-4 py-3">ایمیل</th>
              <th className="px-4 py-3">وضعیت</th>
              <th className="px-4 py-3 text-center">اقدامات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2d4a]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-gray-100">{item.name}</td>
                <td className="px-4 py-3 text-gray-300">{item.studentId}</td>
                <td className="px-4 py-3 text-gray-300">{item.major}</td>
                <td className="px-4 py-3 text-gray-300">{item.entryYear}</td>
                <td className="px-4 py-3 text-gray-300">{item.role}</td>
                <td className="px-4 py-3 text-gray-300">{item.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-vazir ${
                      item.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}
                  >
                    <span className="w-1 h-1 rounded-full mr-1 bg-current" />
                    {item.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-md bg-white/5 text-gray-200 hover:bg-white/10 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-gray-500 font-vazir"
                >
                  هنوز هیچ عضوی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-vazir font-semibold text-gray-100">
                {modal.editing ? "ویرایش عضو" : "افزودن عضو جدید"}
              </h2>
              <button
                onClick={close}
                className="p-1.5 rounded-md bg-white/5 text-gray-300 hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-vazir">
                  نام و نام خانوادگی
                </label>
                <input
                  className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              {/* Student ID */}
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-vazir">
                  شماره دانشجویی
                </label>
                <input
                  className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, studentId: e.target.value }))
                  }
                />
              </div>

              {/* Major & Entry year */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-vazir">
                    رشته / گرایش
                  </label>
                  <input
                    className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                    value={form.major}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, major: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-vazir">
                    سال ورود
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                    value={form.entryYear}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        entryYear: Number(e.target.value) || f.entryYear,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-vazir">
                  نقش در انجمن
                </label>
                <input
                  className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-vazir">
                    ایمیل
                  </label>
                  <input
                    className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-vazir">
                    شماره تماس (اختیاری)
                  </label>
                  <input
                    className="w-full rounded-lg bg-[#0a0f1e] border border-[#1e2d4a] px-3 py-2 text-xs text-gray-100 font-vazir focus:outline-none focus:border-[#00d4ff]"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-vazir">
                  وضعیت
                </label>
                <div className="flex items-center gap-3 text-[11px] font-vazir">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, status: "active" }))
                    }
                    className={`px-3 py-1 rounded-full border text-xs ${
                      form.status === "active"
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : "bg-transparent border-[#1e2d4a] text-gray-400"
                    }`}
                  >
                    فعال
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, status: "inactive" }))
                    }
                    className={`px-3 py-1 rounded-full border text-xs ${
                      form.status === "inactive"
                        ? "bg-red-500/10 border-red-500/50 text-red-400"
                        : "bg-transparent border-[#1e2d4a] text-gray-400"
                    }`}
                  >
                    غیرفعال
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={close}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-300 font-vazir hover:bg-white/10"
              >
                <X size={14} />
                <span>انصراف</span>
              </button>
              <button
                onClick={save}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d4ff] text-xs text-[#0a0f1e] font-vazir font-semibold hover:bg-[#22e0ff]"
              >
                <Check size={14} />
                <span>ثبت</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
