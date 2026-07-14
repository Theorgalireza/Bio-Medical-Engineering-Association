"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  GraduationCap,
  Building2,
  BookOpen,
  Hash,
  CalendarDays,
  Globe,
  Save,
  LogOut,
  Pencil,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateMyProfile, type Profile } from "@/lib/api";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/roles";
import NeonButton from "@/components/ui/NeonButton";
import ProfileGuard from "@/components/profile/ProfileGuard";
import Spinner from "@/components/ui/Spinner";

type ProfileForm = {
  firstName: string;
  lastName: string;
  studentId: string;
  university: string;
  major: string;
  field: string;
  entryYear: string;
  github: string;
  linkedin: string;
  website: string;
  profileEmail: string;
};

const emptyForm: ProfileForm = {
  firstName: "",
  lastName: "",
  studentId: "",
  university: "",
  major: "",
  field: "",
  entryYear: "",
  github: "",
  linkedin: "",
  website: "",
  profileEmail: "",
};

function toForm(profile: Profile | null | undefined): ProfileForm {
  if (!profile) return emptyForm;
  return {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    studentId: profile.studentId ?? "",
    university: profile.university ?? "",
    major: profile.major ?? "",
    field: profile.field ?? "",
    entryYear: profile.entryYear ? String(profile.entryYear) : "",
    github: profile.github ?? "",
    linkedin: profile.linkedin ?? "",
    website: profile.website ?? "",
    profileEmail: profile.profileEmail ?? "",
  };
}

function ProfilePageContent() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<ProfileForm>(toForm(user?.profile));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    setForm(toForm(user?.profile));
  }, [user]);

  const displayName =
    user?.profile?.firstName || user?.profile?.lastName
      ? `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim()
      : "کاربر بدون نام";

  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : "";
  const roleColor = user?.role ? ROLE_COLORS[user.role] ?? "" : "";

  const handleChange = (key: keyof ProfileForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateMyProfile({
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        studentId: form.studentId || null,
        university: form.university || null,
        major: form.major || null,
        field: form.field || null,
        entryYear: form.entryYear ? Number(form.entryYear) : null,
        github: form.github || null,
        linkedin: form.linkedin || null,
        website: form.website || null,
        profileEmail: form.profileEmail || null,
      });
      await refreshUser();
      setStatus({ type: "success", msg: "پروفایل با موفقیت به‌روزرسانی شد." });
      setEditMode(false);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err instanceof Error ? err.message : "خطا در به‌روزرسانی پروفایل.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const infoFields: {
    icon: React.ReactNode;
    label: string;
    key: keyof ProfileForm;
    placeholder: string;
  }[] = [
    { icon: <User size={16} />, label: "نام", key: "firstName", placeholder: "مثلاً علی" },
    { icon: <User size={16} />, label: "نام‌خانوادگی", key: "lastName", placeholder: "مثلاً محمدی" },
    { icon: <Hash size={16} />, label: "شماره دانشجویی", key: "studentId", placeholder: "۹۹۱۲۳۴۵۶" },
    { icon: <Building2 size={16} />, label: "دانشگاه", key: "university", placeholder: "دانشگاه صنعتی..." },
    { icon: <GraduationCap size={16} />, label: "رشته", key: "major", placeholder: "مهندسی پزشکی" },
    { icon: <BookOpen size={16} />, label: "گرایش", key: "field", placeholder: "بیوالکتریک" },
    { icon: <CalendarDays size={16} />, label: "سال ورود", key: "entryYear", placeholder: "۱۴۰۲" },
    { icon: <Mail size={16} />, label: "ایمیل نمایشی", key: "profileEmail", placeholder: "email@example.com" },
    { icon: <Github size={16} />, label: "گیت‌هاب", key: "github", placeholder: "https://github.com/username" },
    { icon: <Linkedin size={16} />, label: "لینکدین", key: "linkedin", placeholder: "https://linkedin.com/in/username" },
    { icon: <Globe size={16} />, label: "وب‌سایت", key: "website", placeholder: "https://example.com" },
  ];

  return (
    <div className="min-h-screen bg-surface pb-20 pt-28 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* هدر پروفایل */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-borderSoft bg-primaryLight/60 p-6 md:p-8"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-neonPurple/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-accent/40 bg-accent/10 shadow-neon md:h-24 md:w-24">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="آواتار" className="h-full w-full object-cover" />
                ) : (
                  <User size={40} className="text-accent" />
                )}
              </div>
              <div className="text-center md:text-right">
                <h1 className="text-xl font-bold text-white md:text-2xl">{displayName}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${roleColor}`}
                  >
                    <ShieldCheck size={13} />
                    {roleLabel}
                  </span>
                  {user?.email && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-primary/40 px-3 py-1 text-xs text-gray-300">
                      <Mail size={13} />
                      {user.email}
                    </span>
                  )}
                  {user?.phone && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-primary/40 px-3 py-1 text-xs text-gray-300">
                      <Phone size={13} />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {!editMode ? (
                <NeonButton
                  type="button"
                  variant="outline"
                  className="!px-5 !py-2 text-sm flex items-center gap-2"
                  onClick={() => {
                    setEditMode(true);
                    setStatus(null);
                  }}
                >
                  <Pencil size={16} />
                  ویرایش پروفایل
                </NeonButton>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setForm(toForm(user?.profile));
                    setStatus(null);
                  }}
                  className="flex items-center gap-2 rounded-full border border-borderSoft bg-primary/40 px-5 py-2 text-sm text-gray-300 hover:bg-primary/60 transition-colors"
                >
                  <X size={16} />
                  انصراف
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={16} />
                خروج
              </button>
            </div>
          </div>
        </motion.div>

        {/* پیام وضعیت */}
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-neonGreen/40 bg-neonGreen/10 text-neonGreen"
                : "border-red-500/40 bg-red-500/10 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {status.msg}
          </motion.div>
        )}

        {/* فرم اطلاعات پروفایل */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-3xl border border-borderSoft bg-primaryLight/40 p-6 md:p-8"
        >
          <h2 className="mb-6 text-lg font-bold text-white">اطلاعات تحصیلی و شخصی</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {infoFields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  {field.icon}
                  {field.label}
                </label>
                {editMode ? (
                  <input
                    type={field.key === "entryYear" ? "number" : "text"}
                    value={form[field.key]}
                    onChange={handleChange(field.key)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-borderSoft bg-primary/60 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-accent/60"
                  />
                ) : (
                  <div className="rounded-xl border border-borderSoft/60 bg-primary/30 px-4 py-2.5 text-sm text-gray-200">
                    {form[field.key] || (
                      <span className="text-gray-500">ثبت نشده</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {editMode && (
            <div className="mt-8 flex justify-end">
              <NeonButton
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 !px-6 !py-2.5 text-sm disabled:opacity-60"
              >
                {saving ? <Spinner size={18} /> : <Save size={16} />}
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </NeonButton>
            </div>
          )}
        </form>

        {/* اطلاعات حساب کاربری */}
        <div className="mt-6 rounded-3xl border border-borderSoft bg-primaryLight/40 p-6 md:p-8">
          <h2 className="mb-4 text-lg font-bold text-white">اطلاعات حساب کاربری</h2>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-borderSoft/60 bg-primary/30 px-4 py-3">
              <span className="text-gray-400">شناسه کاربری</span>
              <span className="font-mono text-xs text-gray-300">{user?.id}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-borderSoft/60 bg-primary/30 px-4 py-3">
              <span className="text-gray-400">تاریخ عضویت</span>
              <span className="text-gray-300">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileGuard>
      <ProfilePageContent />
    </ProfileGuard>
  );
}
