"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { Mail, Phone, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { getOAuthLoginUrl, register, type OAuthProvider } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";

const ADMIN_ROLES = new Set(["OWNER", "ADMIN", "CONTENT_EDITOR"]);

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

const [form, setForm] = useState({
  email: "",
  phone: "",
  password: "",
});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = (provider: OAuthProvider) => {
    window.location.href = getOAuthLoginUrl(provider);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");

  const email = form.email.trim();
  const phone = form.phone.trim();
  const password = form.password;

  if (!email && !phone) {
    setError("وارد کردن ایمیل یا شماره موبایل الزامی است.");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      ...(email && { email }),
      ...(phone && { phone }),
      ...(password && { password }),
    };

    const { user } = await register(payload);
    const currentUser = await refreshUser();
    const role = currentUser?.role || user.role;
    router.push(ADMIN_ROLES.has(role) ? "/admin" : "/");
  } catch (err) {
    setError(
      err instanceof Error && err.message
        ? err.message
        : "ثبت‌نام انجام نشد. اطلاعات واردشده را بررسی کنید."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0f1e] px-4" dir="rtl">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-5 rounded-2xl border border-[#1e2d4a] bg-[#0d1526] p-8"
      >
        <h1 className="text-center text-xl font-bold text-white font-vazir">ایجاد حساب کاربری</h1>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-borderSoft bg-surface hover:border-accent transition"
            aria-label="ثبت‌نام با گوگل"
          >
            <FcGoogle size={24} />
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin("github")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-borderSoft bg-surface hover:border-accent transition"
            aria-label="ثبت‌نام با گیت‌هاب"
          >
            <FaGithub size={22} className="text-white" />
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin("linkedin")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-borderSoft bg-surface hover:border-accent transition"
            aria-label="ثبت‌نام با لینکدین"
          >
            <FaLinkedinIn size={22} className="text-[#0A66C2]" />
          </button>
        </div>

        <div className="relative flex items-center justify-center py-1">
          <span className="h-px w-full bg-white/10" />
          <span className="absolute bg-[#0d1526] px-3 text-xs text-gray-500">یا</span>
        </div>

        <div className="relative">
          <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="ایمیل (اختیاری)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] py-2.5 pr-9 pl-4 text-sm text-white placeholder-gray-600 font-vazir focus:outline-none focus:border-[#00d4ff]/50"
          />
        </div>

        <div className="relative">
          <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="tel"
            placeholder="شماره موبایل (اختیاری)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] py-2.5 pr-9 pl-4 text-sm text-white placeholder-gray-600 font-vazir focus:outline-none focus:border-[#00d4ff]/50"
          />
        </div>

        <div className="relative">
          <LockKeyhole size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور (اختیاری)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-[#1e2d4a] bg-[#0a0f1e] py-2.5 pr-9 pl-10 text-sm text-white placeholder-gray-600 font-vazir focus:outline-none focus:border-[#00d4ff]/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <p className="text-xs text-gray-500 font-vazir">
حداقل یکی از ایمیل یا موبایل الزامی است.         </p>

        {error && <p className="text-center text-sm text-red-400 font-vazir">{error}</p>}

        <NeonButton type="submit" disabled={loading} className="w-full">
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </NeonButton>

        <p className="text-center text-sm text-gray-500 font-vazir">
          حساب دارید؟{" "}
          <Link href="/login" className="text-[#00d4ff] hover:underline">
            وارد شوید
          </Link>
        </p>
      </motion.form>
    </main>
  );
}
