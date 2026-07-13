"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Megaphone, BookOpen, Users, MessageSquare, Mail, Menu, X, Activity,
} from "lucide-react";
const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/announcements", label: "اعلان‌ها", icon: Megaphone },
  { href: "/admin/articles", label: "مقالات", icon: BookOpen },
  { href: "/admin/faculty", label: "اعضای هیئت علمی", icon: Users },
  { href: "/admin/members", label: "اعضای انجمن", icon: Users }, // NEW
  { href: "/admin/feedback", label: "بازخوردها", icon: MessageSquare },
  { href: "/admin/contacts", label: "تماس‌ها", icon: Mail },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-[#0d1526] border-l border-[#1e2d4a] flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1e2d4a]">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-[#00d4ff]" />
              <span className="font-bold text-sm text-[#00d4ff]">پنل ادمین</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                  ${active ? "bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-[#0d1526] border-b border-[#1e2d4a] flex items-center justify-between px-6">
<h1 className="text-sm text-gray-300 font-vazir font-semibold tracking-tight">
  پنل مدیریت انجمن مهندسی پزشکی
</h1>       <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-gray-500 font-vazir">آنلاین</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
