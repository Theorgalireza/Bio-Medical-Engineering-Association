"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Eye, Users, TrendingUp, CalendarDays } from "lucide-react";
import { adminGetAnalytics } from "@/lib/api";
import type { AnalyticsStats } from "@/types";
import Spinner from "@/components/ui/Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGetAnalytics()
      .then((res: any) => setStats(res?.data ?? res))
      .catch(() => setError("خطا در دریافت آمار بازدید"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error || !stats) return <p className="text-red-500">{error}</p>;

  const cards = [
    { label: "کل بازدیدها", value: stats.totalViews, icon: Eye },
    { label: "بازدید امروز", value: stats.todayViews, icon: CalendarDays },
    { label: "بازدید ۳۰ روز اخیر", value: stats.monthViews, icon: TrendingUp },
    { label: "بازدیدکنندگان یکتای امروز", value: stats.uniqueTodayVisitors, icon: Users },
  ];

  const dailyData = {
    labels: stats.dailyViews.map((d) => d.date),
    datasets: [
      {
        label: "بازدید روزانه",
        data: stats.dailyViews.map((d) => d.count),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(34,211,238,0.2)",
        tension: 0.3,
      },
    ],
  };

  const topPagesData = {
    labels: stats.topPages.map((p) => p.path),
    datasets: [
      {
        label: "بازدید",
        data: stats.topPages.map((p) => p.count),
        backgroundColor: "#818cf8",
      },
    ],
  };

  return (
    <div className="space-y-8" dir="rtl">
      <h1 className="text-2xl font-bold">آمار بازدید سایت</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 flex items-center gap-3"
          >
            <Icon className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-xl font-semibold">{value.toLocaleString("fa-IR")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h2 className="mb-3 font-medium">روند بازدید ۷ روز اخیر</h2>
          <Line data={dailyData} />
        </div>
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
          <h2 className="mb-3 font-medium">پربازدیدترین صفحات</h2>
          <Bar data={topPagesData} />
        </div>
      </div>
    </div>
  );
}
