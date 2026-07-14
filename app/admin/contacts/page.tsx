"use client";
import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { adminDeleteContact, adminGetContacts, adminMarkContactRead } from "@/lib/api";
import type { AdminContact } from "@/types";

export default function ContactsPage() {
  const [items, setItems] = useState<AdminContact[]>([]);
  const [selected, setSelected] = useState<AdminContact | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setItems(await adminGetContacts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await adminMarkContactRead(id);
    await load();
  };

  return (
    <div className="space-y-5" dir="rtl">
      <h2 className="text-xl font-bold">پیام‌های تماس</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          {!loading && items.map(item => (
            <button key={item.id} onClick={async () => { setSelected(item); await markRead(item.id); }}
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
          {loading && <p className="text-sm text-gray-500 p-4">در حال بارگذاری...</p>}
        </div>

        {selected ? (
          <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-200">{selected.subject}</h3>
                <p className="text-xs text-gray-500 mt-1 font-vazir">{selected.name} — {selected.email}</p>
              </div>
              <button onClick={async () => { await adminDeleteContact(selected.id); setSelected(null); await load(); }}
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
