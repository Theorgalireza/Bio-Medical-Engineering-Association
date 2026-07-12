"use client";
import { useState } from "react";
import { mockFeedback, type Feedback } from "@/lib/mockData";
import { Trash2, Star } from "lucide-react";

export default function FeedbackPage() {
  const [items, setItems] = useState<Feedback[]>(mockFeedback);

  return (
    <div className="space-y-5" dir="rtl">
      <h2 className="text-xl font-bold">بازخوردها</h2>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-medium text-gray-200">{item.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < item.rating ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-600"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-400">{item.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, approved: !i.approved } : i))}
                  className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${item.approved ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-gray-500/15 text-gray-400"}`}>
                  {item.approved ? "تأیید شده" : "در انتظار"}
                </button>
                <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
