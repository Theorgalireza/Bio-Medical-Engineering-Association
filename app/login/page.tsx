"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { getOAuthLoginUrl, loginWithPassword, type OAuthProvider } from "@/lib/api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleOAuthLogin = (provider: OAuthProvider) => {
    window.location.href = getOAuthLoginUrl(provider);
  };

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { user } = await loginWithPassword(form);
    router.push(user.role === "ADMIN" ? "/admin" : "/");
  } catch {
    setError("ایمیل یا رمز عبور اشتباه است.");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen px-4 pb-16 pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">
            پورتال اعضا
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              برای داشبورد خود وارد شوید
            </h1>
            <p className="max-w-xl text-lg leading-8 text-gray-300">
              از طریق این پنل امن به اطلاعیه‌ها، رویدادها و منابع اعضا دسترسی داشته باشید.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "دسترسی سریع", text: "به‌روزرسانی‌ها و مهلت‌ها را فوراً ببینید." },
              { title: "محیط خصوصی", text: "با حساب کاربری خود به محتوای امن دسترسی پیدا کنید." },
              { title: "تجربه مدرن", text: "رابطی شفاف و جذاب برای اعضای انجمن." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-borderSoft bg-primary/70 p-4 shadow-[0_0_20px_rgba(0,212,255,0.08)]"
              >
                <h2 className="mb-2 text-sm font-semibold text-accent">{item.title}</h2>
                <p className="text-sm leading-7 text-gray-400">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-borderSoft bg-primary/80 p-6 shadow-[0_0_40px_rgba(0,212,255,0.12)] backdrop-blur-xl md:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-accent">خوش آمدید</p>
              <h2 className="text-2xl font-semibold text-white">ورود به حساب</h2>
            </div>
            <Link href="/" className="text-sm text-gray-400 transition hover:text-accent">
              بازگشت به خانه
            </Link>
          </div>

          <div className="space-y-4">
            <div className="mt-6 flex justify-center gap-4">
  <button
    type="button"
    onClick={() =>
      window.location.href =
        "http://localhost:3001/api/v1/auth/google"
    }
    className="flex h-12 w-12 items-center justify-center rounded-full border border-borderSoft bg-surface hover:border-accent transition"
  >
    <FcGoogle size={24} />
  </button>

  <button
    type="button"
    onClick={() =>
      window.location.href =
        "http://localhost:3001/api/v1/auth/github"
    }
    className="flex h-12 w-12 items-center justify-center rounded-full border border-borderSoft bg-surface hover:border-accent transition"
  >
    <FaGithub size={22} className="text-white" />
  </button>

  <button
    type="button"
    onClick={() =>
      window.location.href =
        "http://localhost:3001/api/v1/auth/linkedin"
    }
    className="flex h-12 w-12 items-center justify-center rounded-full border border-borderSoft bg-surface hover:border-accent transition"
  >
    <FaLinkedinIn size={22} className="text-[#0A66C2]" />
  </button>
</div>
            <div className="relative flex items-center justify-center py-1">
              <span className="h-px w-full bg-white/10" />
              <span className="absolute bg-primary/80 px-3 text-xs text-gray-500">یا</span>
            </div>

            <div className="relative">
              <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-borderSoft bg-surface/70 py-3 pr-12 pl-4 text-white outline-none transition focus:border-accent"
                required
              />
            </div>

            <div className="relative">
              <LockKeyhole className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="رمز عبور خود را وارد کنید"
                className="w-full rounded-2xl border border-borderSoft bg-surface/70 py-3 pr-12 pl-12 text-white outline-none transition focus:border-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-accent"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-borderSoft bg-surface" />
                <span>مرا به خاطر بسپار</span>
              </label>
              <Link href="/forgot-password" className="transition hover:text-accent">
                رمز عبور را فراموش کرده‌ام؟
              </Link>
            </div>

            <NeonButton type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود"}
            </NeonButton>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <p className="mt-4 text-center text-sm text-gray-500 font-vazir">
            حساب ندارید؟{" "}
            <Link href="/register" className="text-accent hover:underline">
              ثبت‌نام کنید
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  );
}