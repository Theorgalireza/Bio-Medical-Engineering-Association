"use client";
import { useState } from "react";
import { mockAnnouncements, type AdminAnnouncement } from "@/lib/mockData";
import RichEditor from "@/components/admin/RichEditor";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const empty: Omit<AdminAnnouncement, "id"> = { title: "", date: "", content: "", published: false };

export default function AnnouncementsPage() {
  const [items, setItems] = useState<AdminAnnouncement[]>(mockAnnouncements);
  const [modal, setModal] = useState<{ open: boolean; editing: AdminAnnouncement | null }>({ open: false, editing: null });
  const [form, setForm] = useState(empty);

  const openAdd = () => { setForm(empty); setModal({ open: true, editing: null }); };
  const openEdit = (item: AdminAnnouncement) => {
    setForm({ title: item.title, date: item.date, content: item.content, published: item.published });
    setModal({ open: true, editing: item });
  };
  const close = () => setModal({ open: false, editing: null });

  const save = () => {
    if (!form.title) return;
    if (modal.editing) {
      setItems(items.map(i => i.id === modal.editing!.id ? { ...i, ...form } : i));
    } else {
      setItems([...items, { ...form, id: Date.now().toString() }]);
    }
    close();
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">اطلاعیه‌ها</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#a855f7] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#a855f7]/80 transition-colors">
          <Plus size={16} /> افزودن
        </button>
      </div>

      <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2d4a] text-gray-400 text-xs font-mono">
              <th className="text-right px-4 py-3">عنوان</th>
              <th className="text-right px-4 py-3">تاریخ</th>
              <th className="text-right px-4 py-3">وضعیت</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-[#1e2d4a]/50 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 text-gray-200">{item.title}</td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{item.date}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, published: !i.published } : i))}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${item.published ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-gray-500/15 text-gray-400"}`}>
                    {item.published ? "منتشر" : "پیش‌نویس"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-[#a855f7] transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8">
          <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-6 w-full max-w-2xl space-y-4 mx-4" dir="rtl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{modal.editing ? "ویرایش اطلاعیه" : "اطلاعیه جدید"}</h3>
              <button onClick={close} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="عنوان اطلاعیه"
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]/50"
              />
              <input
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                placeholder="تاریخ (مثال: ۱۴۰۳/۰۹/۱۵)"
                className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]/50"
              />
              <RichEditor
                value={form.content}
                onChange={content => setForm({ ...form, content })}
                placeholder="متن اطلاعیه را بنویسید..."
                minHeight="240px"
              />
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm({ ...form, published: e.target.checked })}
                  className="accent-[#a855f7]"
                />
                منتشر شود
              </label>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={close} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">انصراف</button>
              <button onClick={save} className="flex items-center gap-2 bg-[#a855f7] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#a855f7]/80 transition-colors">
                <Check size={15} /> ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
