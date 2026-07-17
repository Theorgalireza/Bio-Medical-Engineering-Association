"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  BookOpen,
  Users,
  MessageSquare,
  Mail,
  TrendingUp,
  Eye,
  BarChart3,
  ArrowLeft,
  Shield,
  Bell,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  adminGetAnnouncements,
  adminGetArticles,
  adminGetContacts,
  adminGetFaculty,
  adminGetFeedback,
  adminGetAnalyticsStats,
  adminGetRoleStats,
} from "@/lib/api";
import type {
  AnalyticsStats,
  RoleStat,
} from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/roles";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

type Stat = {
  label: string;
  value: number;
  published: number;
  href: string;
  icon: LucideIcon;
  color: string;
};

const contentStats: Stat[] = [
  { label: "اعلان‌ها", value: 0, published: 0, href: "/admin/announcements", icon: Megaphone, color: "#00d4ff" },
  { label: "مقالات", value: 0, published: 0, href: "/admin/articles", icon: BookOpen, color: "#a855f7" },
  { label: "هیئت علمی", value: 0, published: 0, href: "/admin/faculty", icon: Users, color: "#22c55e" },
  { label: "بازخوردها", value: 0, published: 0, href: "/admin/feedback", icon: MessageSquare, color: "#f59e0b" },
  { label: "پیام‌های تماس", value: 0, published: 0, href: "/admin/contacts", icon: Mail, color: "#ef4444" },
];

const privilegedCards: Stat[] = [
  { label: "خبرنامه", value: 0, published: 0, href: "/admin/newsletter", icon: Bell, color: "#38bdf8" },
  { label: "تنظیمات سایت", value: 0, published: 0, href: "/admin/settings", icon: Shield, color: "#a855f7" },
  { label: "لاگ فعالیت‌ها", value: 0, published: 0, href: "/admin/logs", icon: BarChart3, color: "#22c55e" },
];

function isPrivileged(role?: string | null) {
  return role === "OWNER" || role === "ADMIN";
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stat[]>(contentStats);
  const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
  const [roleStats, setRoleStats] = useState<RoleStat[]>([]);
  const [loading, setLoading] = useState(true);

  const privileged = useMemo(() => isPrivileged(user?.role), [user?.role]);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      adminGetAnnouncements().catch(() => []),
      adminGetArticles().catch(() => []),
      adminGetFaculty().catch(() => []),
      privileged ? adminGetFeedback().catch(() => []) : Promise.resolve([]),
      privileged ? adminGetContacts().catch(() => []) : Promise.resolve([]),
      privileged ? adminGetAnalyticsStats().catch(() => null) : Promise.resolve(null),
      privileged ? adminGetRoleStats().catch(() => []) : Promise.resolve([]),
    ]).then(([announcements, articles, faculty, feedback, contacts, analyticsStats, statsByRole]) => {
      if (!mounted) return;

      const nextStats: Stat[] = [
        {
          ...contentStats[0],
          value: announcements.length,
          published: announcements.filter((item) => item.published).length,
        },
        {
          ...contentStats[1],
          value: articles.length,
          published: articles.filter((item) => item.published).length,
        },
        {
          ...contentStats[2],
          value: faculty.length,
          published: faculty.filter((item) => item.isActive !== false).length,
        },
        {
          ...contentStats[3],
          value: feedback.length,
          published: feedback.filter((item) => item.approved).length,
        },
        {
          ...contentStats[4],
          value: contacts.length,
          published: contacts.filter((item) => item.read).length,
        },
      ];

      setStats(privileged ? [...nextStats, ...privilegedCards] : nextStats);
      setAnalytics(analyticsStats);
      setRoleStats(statsByRole);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [privileged]);

  const roleSummary = roleStats.length
    ? roleStats
        .map((row) => `${ROLE_LABELS[row.role] ?? row.role}: ${row.count}`)
        .join(" • ")
    : "";
  const dailyData = analytics
    ? {
        labels: analytics.dailyViews.map((d) => d.date),
        datasets: [
          {
            label: "بازدید روزانه",
            data: analytics.dailyViews.map((d) => d.count),
            borderColor: "#22d3ee",
            backgroundColor: "rgba(34,211,238,0.2)",
            tension: 0.3,
          },
        ],
      }
    : null;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={22} className="text-[#00d4ff]" />
          <h2 className="text-xl font-bold">داشبورد</h2>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-[#0d1526] border border-[#1e2d4a] text-gray-300 hover:text-white hover:border-[#00d4ff] rounded-lg transition-all text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>بازگشت به سایت</span>
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-400">
          در حال بارگذاری آمار...
        </div>
      ) : (
        <>
          {privileged && analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#00d4ff15" }}>
                  <Eye size={20} style={{ color: "#00d4ff" }} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-vazir" style={{ color: "#00d4ff" }}>
                    {analytics.totalViews.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">کل بازدید</p>
                </div>
              </div>

              <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#22c55e15" }}>
                  <TrendingUp size={20} style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-vazir" style={{ color: "#22c55e" }}>
                    {analytics.todayViews.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">بازدید امروز</p>
                </div>
              </div>

              <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 flex items-center gap-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#a855f715" }}>
                  <Users size={20} style={{ color: "#a855f7" }} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-vazir" style={{ color: "#a855f7" }}>
                    {analytics.uniqueTodayVisitors.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">بازدیدکننده منحصربه‌فرد امروز</p>
                </div>
              </div>
            </div>
          )}

          {privileged && analytics && dailyData && analytics.dailyViews.length > 0 && (
            <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-[#00d4ff]" />
                <h3 className="font-semibold text-sm">روند بازدید ۷ روز اخیر</h3>
              </div>
              <Line
                data={dailyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: { rtl: true, titleAlign: "right", bodyAlign: "right" },
                  },
                  scales: {
                    x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
                    y: {
                      ticks: { color: "#9ca3af", stepSize: 1 },
                      grid: { color: "rgba(255,255,255,0.05)" },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}



          {privileged && analytics && analytics.topPages.length > 0 && (
            <div className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">صفحات پربازدید</h3>
              <div className="space-y-2">
                {analytics.topPages.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between text-sm border-b border-[#1e2d4a] last:border-0 pb-2 last:pb-0"
                  >
                    <span className="text-gray-300 font-mono truncate">{page.path}</span>
                    <span className="text-[#00d4ff] font-vazir font-bold">
                      {page.count.toLocaleString("fa-IR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {stats.map(({ label, value, published, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="bg-[#0d1526] border border-[#1e2d4a] rounded-xl p-5 hover:border-[#00d4ff]/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span className="text-3xl font-bold font-vazir" style={{ color }}>
                    {value}
                  </span>
                </div>
                <p className="text-gray-300 text-sm font-medium">{label}</p>
                <p className="text-gray-500 text-xs mt-1 font-vazir">
                  {label === "پیام‌های تماس" ? `${published} خوانده شده` : `${published} منتشر شده`}
                </p>
              </Link>
            ))}
          </div>

          {!privileged && (
            <div className="rounded-2xl border border-[#1e2d4a] bg-[#0d1526] p-5 text-sm text-gray-400">
              این سطح دسترسی فقط برای مدیریت محتوا فعال است. داده‌های حساس‌تر مانند آمار بازدید، تماس‌ها، خبرنامه و تنظیمات برای مدیران سیستم باقی می‌ماند.
            </div>
          )}
        </>
      )}
    </div>
  );
}
