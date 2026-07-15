"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getActivityLogs } from "@/lib/api";
import type { ActivityLog } from "@/types";

const ACTION_LABELS: Record<string, string> = {
  CREATE_USER: "ایجاد کاربر",
  DELETE_USER: "حذف کاربر",
  UPDATE_ROLE: "تغییر نقش",
  UPDATE_STATUS: "تغییر وضعیت",
  UPDATE_PROFILE: "ویرایش پروفایل",
  CREATE_ARTICLE: "ایجاد مقاله",
  DELETE_ARTICLE: "حذف مقاله",
  CREATE_ANNOUNCEMENT: "ایجاد اطلاعیه",
  DELETE_ANNOUNCEMENT: "حذف اطلاعیه",
};

const ACTION_COLORS: Record<string, string> = {
  DELETE_USER: "text-red-400",
  DELETE_ARTICLE: "text-red-400",
  DELETE_ANNOUNCEMENT: "text-red-400",
  CREATE_USER: "text-green-400",
  CREATE_ARTICLE: "text-green-400",
  UPDATE_ROLE: "text-yellow-400",
  UPDATE_STATUS: "text-blue-400",
};

export default function LogsPage() {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "OWNER") {
      setError("فقط مالک سیستم به این صفحه دسترسی دارد.");
      setLoading(false);
      return;
    }
    getActivityLogs()
      .then(setLogs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  const filtered = filter
    ? logs.filter(
        (l) =>
          l.action.includes(filter.toUpperCase()) ||
          l.actorEmail?.includes(filter) ||
          l.detail?.includes(filter)
      )
    : logs;

  return (
    <div className="p-6 text-white" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">لاگ فعالیت‌ها</h1>
        <input
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-56"
          placeholder="جستجو..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading && <p className="text-gray-400">در حال بارگذاری...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-3 px-4 text-right">زمان</th>
                <th className="py-3 px-4 text-right">عملیات</th>
                <th className="py-3 px-4 text-right">انجام‌دهنده</th>
                <th className="py-3 px-4 text-right">جزئیات</th>
                <th className="py-3 px-4 text-right">هدف</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("fa-IR")}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${ACTION_COLORS[log.action] ?? "text-gray-300"}`}>
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs">
                    {log.actorEmail ?? log.actorId ?? "سیستم"}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{log.detail ?? "—"}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {log.targetType ? `${log.targetType} #${log.targetId?.slice(0, 8)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-8">هیچ لاگی یافت نشد</p>
          )}
        </div>
      )}
    </div>
  );
}
