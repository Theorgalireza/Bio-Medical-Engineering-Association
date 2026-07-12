import { mockAnnouncements, mockArticles, mockFaculty, mockFeedback, mockContacts } from "@/data/mockData";
import { Megaphone, BookOpen, Users, MessageSquare, Mail, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "اعلان‌ها", value: mockAnnouncements.length, published: mockAnnouncements.filter(a => a.published).length, href: "/admin/announcements", icon: Megaphone, color: "#00d4ff" },
  { label: "مقالات", value: mockArticles.length, published: mockArticles.filter(a => a.published).length, href: "/admin/articles", icon: BookOpen, color: "#a855f7" },
  { label: "هیئت علمی", value: mockFaculty.length, published: mockFaculty.length, href: "/admin/faculty", icon: Users, color: "#22c55e" },
  { label: "بازخوردها", value: mockFeedback.length, published: mockFeedback.filter(f => f.approved).length, href: "/admin/feedback", icon: MessageSquare, color: "#f59e0b" },
  { label: "پیام‌های تماس", value: mockContacts.length, published: mockContacts.filter(c => c.read).length, href: "/admin/contacts", icon: Mail, color: "#ef4444" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <TrendingUp size={22} className="text-[#00d4ff]" />
        <h2 className="text-xl font-bold">داشبورد</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map(({ label, value, published, href, icon: Icon, color }) => (
          <Link key={href} href={href}
            className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 hover:border-[#00d4ff]/30 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-3xl font-bold font-vazir" style={{ color }}>{value}</span>
            </div>
            <p className="text-gray-300 text-sm font-medium">{label}</p>
            <p className="text-gray-500 text-xs mt-1 font-vazir">
              {label === "پیام‌های تماس" ? `${published} خوانده شده` : `${published} منتشر شده`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
