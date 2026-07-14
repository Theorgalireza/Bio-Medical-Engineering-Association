"use client";

import { useEffect, useState } from "react";
import { Megaphone, BookOpen, Users, MessageSquare, Mail, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { adminGetAnnouncements, adminGetArticles, adminGetContacts, adminGetFaculty, adminGetFeedback } from "@/lib/api";

type Stat = {
  label: string;
  value: number;
  published: number;
  href: string;
  icon: LucideIcon;
  color: string;
};

const baseStats: Stat[] = [
  { label: "اعلان‌ها", value: 0, published: 0, href: "/admin/announcements", icon: Megaphone, color: "#00d4ff" },
  { label: "مقالات", value: 0, published: 0, href: "/admin/articles", icon: BookOpen, color: "#a855f7" },
  { label: "هیئت علمی", value: 0, published: 0, href: "/admin/faculty", icon: Users, color: "#22c55e" },
  { label: "بازخوردها", value: 0, published: 0, href: "/admin/feedback", icon: MessageSquare, color: "#f59e0b" },
  { label: "پیام‌های تماس", value: 0, published: 0, href: "/admin/contacts", icon: Mail, color: "#ef4444" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>(baseStats);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminGetAnnouncements(),
      adminGetArticles(),
      adminGetFaculty(),
      adminGetFeedback(),
      adminGetContacts(),
    ])
      .then(([announcements, articles, faculty, feedback, contacts]) => {
        if (!mounted) return;
        setStats([
          {
            ...baseStats[0],
            value: announcements.length,
            published: announcements.filter((item) => item.published).length,
          },
          {
            ...baseStats[1],
            value: articles.length,
            published: articles.filter((item) => item.published).length,
          },
          {
            ...baseStats[2],
            value: faculty.length,
            published: faculty.filter((item) => item.isActive !== false).length,
          },
          {
            ...baseStats[3],
            value: feedback.length,
            published: feedback.filter((item) => item.approved).length,
          },
          {
            ...baseStats[4],
            value: contacts.length,
            published: contacts.filter((item) => item.read).length,
          },
        ]);
      })
      .catch(() => {
        if (!mounted) return;
        setStats(baseStats);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
