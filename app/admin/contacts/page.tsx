"use client";
import { useState } from "react";
import { mockContacts, type Contact } from "@/data/mockData";
import { Trash2, Mail, MailOpen } from "lucide-react";

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>(mockContacts);
  const [selected, setSelected] = useState<Contact | null>(null);

  const markRead = (id: string) => setItems(items.map(i => i.id === id ? { ...i, read: true } : i));

  return (
    <div className="space-y-5" dir="rtl">
      <h2 className="text-xl font-bold">پیام‌های تماس</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          {items.map(item => (
            <button key={item.id} onClick={() => { setSelected(item); markRead(item.id); }}
              className={`w-full text-right bg-[#0d1526] border rounded-xl p-4 transition-colors hover:border-[#00d4ff]/30
                ${selected?.id === item.id ? "border-[#00d4ff]/40" : "border-[#1e2d4a]"}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {item.read ? <MailOpen size={16} className="text-gray-500" /> : <Mail size={16} className="text-[#00d4ff]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${item.read ? "text-gray-400" : "text-gray-200"}`}>{item.name}</span>
                    <span className="text-xs text-gray-500 font-vazir shrink-0">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subject}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-200">{selected.subject}</h3>
                <p className="text-xs text-gray-500 mt-1 font-vazir">{selected.name} — {selected.email}</p>
              </div>
              <button onClick={() => { setItems(items.filter(i => i.id !== selected.id)); setSelected(null); }}
                className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed border-t border-[#1e2d4a] pt-4">{selected.message}</p>
            <p className="text-xs text-gray-500 font-vazir">{selected.date}</p>
          </div>
        ) : (
          <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 flex items-center justify-center text-gray-500 text-sm">
            یک پیام انتخاب کنید
          </div>
        )}
      </div>
    </div>
  );
}
