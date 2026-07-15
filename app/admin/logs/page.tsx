"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getActivityLogs } from "@/lib/api";
import type { ActivityLog } from "@/types";

const ACTION_LABELS: Record<string, string> = {
  REGISTER: "ثبت‌نام",
  LOGIN: "ورود",
  SEND_OTP: "ارسال OTP",
  FORGOT_PASSWORD: "فراموشی رمز",
  RESET_PASSWORD: "بازنشانی رمز",
  OAUTH_LOGIN: "ورود با OAuth",
  OAUTH_REGISTER: "ثبت‌نام با OAuth",
  CREATE_USER: "ایجاد کاربر",
  UPDATE_USER_PROFILE: "ویرایش پروفایل",
  UPDATE_USER_STATUS: "تغییر وضعیت",
  UPDATE_USER_ROLE: "تغییر نقش",
  DELETE_USER: "حذف کاربر",
  CREATE_ARTICLE: "ایجاد مقاله",
  UPDATE_ARTICLE: "ویرایش مقاله",
  DELETE_ARTICLE: "حذف مقاله",
  PUBLISH_ARTICLE: "انتشار مقاله",
  UNPUBLISH_ARTICLE: "لغو انتشار مقاله",
  CREATE_ANNOUNCEMENT: "ایجاد اطلاعیه",
  UPDATE_ANNOUNCEMENT: "ویرایش اطلاعیه",
  DELETE_ANNOUNCEMENT: "حذف اطلاعیه",
  PUBLISH_ANNOUNCEMENT: "انتشار اطلاعیه",
  UNPUBLISH_ANNOUNCEMENT: "لغو انتشار اطلاعیه",
  RECEIVE_CONTACT_MESSAGE: "دریافت پیام تماس",
  DELETE_CONTACT_MESSAGE: "حذف پیام تماس",
  MARK_CONTACT_READ: "علامت‌گذاری پیام تماس",
  CREATE_FACULTY: "ایجاد عضو هیئت علمی",
  UPDATE_FACULTY: "ویرایش عضو هیئت علمی",
  DELETE_FACULTY: "حذف عضو هیئت علمی",
  RECEIVE_FEEDBACK: "دریافت بازخورد",
  DELETE_FEEDBACK: "حذف بازخورد",
  CREATE_GALLERY_ITEM: "ایجاد آیتم گالری",
  UPDATE_GALLERY_ITEM: "ویرایش آیتم گالری",
  DELETE_GALLERY_ITEM: "حذف آیتم گالری",
};

const ACTION_BADGES: Record<string, string> = {
  DELETE_USER: "border-red-500/30 bg-red-500/10 text-red-200",
  DELETE_ARTICLE: "border-red-500/30 bg-red-500/10 text-red-200",
  DELETE_ANNOUNCEMENT: "border-red-500/30 bg-red-500/10 text-red-200",
  DELETE_CONTACT_MESSAGE: "border-red-500/30 bg-red-500/10 text-red-200",
  DELETE_FACULTY: "border-red-500/30 bg-red-500/10 text-red-200",
  DELETE_FEEDBACK: "border-red-500/30 bg-red-500/10 text-red-200",
  DELETE_GALLERY_ITEM: "border-red-500/30 bg-red-500/10 text-red-200",
  CREATE_USER: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  CREATE_ARTICLE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  CREATE_ANNOUNCEMENT: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  CREATE_FACULTY: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  CREATE_GALLERY_ITEM: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  RECEIVE_CONTACT_MESSAGE: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  RECEIVE_FEEDBACK: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
  LOGIN: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  REGISTER: "border-sky-500/30 bg-sky-500/10 text-sky-200",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function actorLabel(log: ActivityLog) {
  return log.actorEmail || log.actorId || "سیستم / ناشناس";
}

function targetLabel(log: ActivityLog) {
  if (!log.targetType) return "—";
  const shortId = log.targetId ? log.targetId.slice(0, 8) : "—";
  return `${log.targetType} #${shortId}`;
}

export default function LogsPage() {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "OWNER") {
      setError("فقط مالک سیستم به این صفحه دسترسی دارد.");
      setLoading(false);
      return;
    }

    setLoading(true);
    getActivityLogs({ page, limit })
      .then((result) => {
        setLogs(result.data);
        setTotalPages(result.meta.totalPages);
        setTotal(result.meta.total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [authLoading, user, page]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return logs;

    return logs.filter((log) => {
      return [
        log.action,
        ACTION_LABELS[log.action] ?? "",
        log.actorEmail ?? "",
        log.actorId ?? "",
        log.targetType ?? "",
        log.targetId ?? "",
        log.detail ?? "",
        log.ip ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [logs, search]);

  return (
    <div className="p-6 text-white" dir="rtl">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">لاگ فعالیت‌ها</h1>
          <p className="mt-1 text-sm text-gray-400">{total.toLocaleString("fa-IR")} رویداد ثبت شده است.</p>
        </div>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-gray-500 lg:w-80"
          placeholder="جستجو در عمل، کاربر، هدف، جزئیات یا IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="text-gray-400">در حال بارگذاری...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">زمان</th>
                  <th className="px-4 py-3 text-right font-medium">عملیات</th>
                  <th className="px-4 py-3 text-right font-medium">انجام‌دهنده</th>
                  <th className="px-4 py-3 text-right font-medium">هدف</th>
                  <th className="px-4 py-3 text-right font-medium">جزئیات</th>
                  <th className="px-4 py-3 text-right font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${ACTION_BADGES[log.action] ?? "border-white/10 bg-white/5 text-white"}`}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-200">{actorLabel(log)}</td>
                    <td className="px-4 py-3 text-gray-300">{targetLabel(log)}</td>
                    <td className="px-4 py-3 text-gray-400">{log.detail ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">{log.ip ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <p className="border-t border-white/5 py-8 text-center text-gray-500">هیچ لاگی یافت نشد</p>
          )}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <button
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            قبلی
          </button>
          <span>
            صفحه {page.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
          </span>
          <button
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
