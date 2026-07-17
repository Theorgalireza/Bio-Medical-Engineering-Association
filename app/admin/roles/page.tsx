"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Shield, Users, UserCog, CheckCircle2, AlertTriangle } from "lucide-react";
import { adminGetRoleStats } from "@/lib/api";
import type { RoleStat } from "@/types";
import { ROLE_LABELS } from "@/lib/roles";
import { useAuth } from "@/context/AuthContext";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  OWNER: ["همه دسترسی‌ها", "مدیریت کاربران", "تنظیمات سایت", "آمار", "خبرنامه", "لاگ فعالیت‌ها"],
  ADMIN: ["مدیریت محتوا", "مدیریت کاربران", "تنظیمات سایت", "آمار", "خبرنامه", "بازخوردها/تماس‌ها"],
  CONTENT_EDITOR: ["مقالات", "اعلان‌ها", "گالری", "ویرایش محتوای عمومی"],
  STUDENT_MEMBER: ["پروفایل", "مشاهده محتوای عمومی"],
  STUDENT_ACTIVE_MEMBER: ["پروفایل", "مشاهده محتوای عمومی"],
  STUDENT_INACTIVE_MEMBER: ["پروفایل", "مشاهده محتوای عمومی"],
  FACULTY_MEMBER: ["پروفایل", "مشاهده محتوای عمومی"],
  GUEST: ["مشاهده محتوای عمومی"],
};

function roleBadge(role: string) {
  switch (role) {
    case "OWNER":
      return "border-neonPurple/30 bg-neonPurple/10 text-neonPurple";
    case "ADMIN":
      return "border-accent/30 bg-accent/10 text-accent";
    case "CONTENT_EDITOR":
      return "border-electric/30 bg-electric/10 text-electric";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

export default function RolesPage() {
  const { user, loading: authLoading } = useAuth();
  const canView = user?.role === "OWNER" || user?.role === "ADMIN";
  const [stats, setStats] = useState<RoleStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!canView) {
      setLoading(false);
      return;
    }

    adminGetRoleStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "دریافت آمار نقش‌ها ناموفق بود."))
      .finally(() => setLoading(false));
  }, [authLoading, canView]);

  const total = useMemo(() => stats.reduce((sum, item) => sum + item.count, 0), [stats]);

  if (authLoading) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/50">در حال بارگذاری...</div>;
  }

  if (!canView) {
    return (
      <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        این بخش فقط برای مدیران سیستم در دسترس است.
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت نقش‌ها</h1>
          <p className="mt-1 text-sm text-white/50">
            این صفحه خلاصه توزیع نقش‌ها را نشان می‌دهد و به صفحه مدیریت اعضا وصل است.
          </p>
        </div>

        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/15"
        >
          <UserCog size={15} />
          مدیریت اعضا
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/50">
          در حال بارگذاری نقش‌ها...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">کل کاربران در نقش‌ها</p>
              <p className="mt-2 text-2xl font-bold text-white">{total.toLocaleString("fa-IR")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">نقش‌های فعال</p>
              <p className="mt-2 text-2xl font-bold text-accent">{stats.length.toLocaleString("fa-IR")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">سطح مدیریتی</p>
              <p className="mt-2 text-2xl font-bold text-neonPurple">OWNER / ADMIN</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1526]">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">نقش</th>
                  <th className="px-4 py-3 text-right font-medium">تعداد</th>
                  <th className="px-4 py-3 text-right font-medium">کاربرد</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row) => (
                  <tr key={row.role} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${roleBadge(row.role)}`}>
                        {ROLE_LABELS[row.role] ?? row.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{row.count.toLocaleString("fa-IR")}</td>
                    <td className="px-4 py-3 text-white/70">
                      {(ROLE_PERMISSIONS[row.role] ?? ["—"]).join(" • ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            <div className="flex items-start gap-2">
              <Shield size={16} className="mt-0.5 text-accent" />
              <p>
                تغییر نقش‌ها و وضعیت کاربران از صفحه اعضا انجام می‌شود. این صفحه فقط آمار و توضیح نقش‌ها را برای تصمیم‌گیری سریع نشان می‌دهد.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
