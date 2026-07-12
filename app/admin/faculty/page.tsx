"use client";
import { useState } from "react";
import { mockFaculty, type FacultyMember } from "@/lib/mockData";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const empty: Omit<FacultyMember, "id"> = { name: "", role: "", field: "", monogram: "", color: "#00d4ff" };

export default function FacultyPage() {
  const [items, setItems] = useState<FacultyMember[]>(mockFaculty);
  const [modal, setModal] = useState<{ open: boolean; editing: FacultyMember | null }>({ open: false, editing: null });
  const [form, setForm] = useState(empty);

  const openAdd = () => { setForm(empty); setModal({ open: true, editing: null }); };
  const openEdit = (item: FacultyMember) => { setForm({ name: item.name, role: item.role, field: item.field, monogram: item.monogram, color: item.color }); setModal({ open: true, editing: item }); };
  const close = () => setModal({ open: false, editing: null });

  const save = () => {
    if (!form.name) return;
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
        <h2 className="text-xl font-bold">هیئت علمی</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#22c55e] text-[#0a0f1e] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#22c55e]/80 transition-colors">
          <Plus size={16} /> افزودن
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
              style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
              {item.monogram}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-200 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.role} — {item.field}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-[#22c55e] transition-colors"><Pencil size={15} /></button>
              <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-6 w-full max-w-md space-y-4" dir="rtl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{modal.editing ? "ویرایش عضو" : "عضو جدید"}</h3>
              <button onClick={close} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name", placeholder: "نام و نام خانوادگی" },
                { key: "role", placeholder: "رتبه علمی (مثال: استاد)" },
                { key: "field", placeholder: "حوزه تخصصی" },
                { key: "monogram", placeholder: "حرف اول نام (مثال: ر)" },
              ].map(({ key, placeholder }) => (
                <input key={key} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-[#0a0f1e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50" />
              ))}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-400">رنگ:</label>
                <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-8 rounded cursor-pointer bg-transparent border-0" />
                <span className="text-xs font-mono text-gray-500">{form.color}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={close} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">انصراف</button>
              <button onClick={save} className="flex items-center gap-2 bg-[#22c55e] text-[#0a0f1e] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#22c55e]/80 transition-colors">
                <Check size={15} /> ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
