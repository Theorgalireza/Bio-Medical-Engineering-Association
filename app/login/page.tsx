"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { useLanguage } from "@/lib/LanguageContext";
import { Mail, ArrowLeft, CheckCircle2, LockKeyhole ,Eye, EyeOff} from "lucide-react";

export default function LoginPage() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen px-4 pb-16 pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, x: language === "fa" ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">
            {t("login", "badge")}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white md:text-5xl">
              {t("login", "title")}
            </h1>
            <p className="max-w-xl text-lg leading-8 text-gray-300">
              {t("login", "description")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: t("login", "feature1Title"), text: t("login", "feature1Text") },
              { title: t("login", "feature2Title"), text: t("login", "feature2Text") },
              { title: t("login", "feature3Title"), text: t("login", "feature3Text") },
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
          initial={{ opacity: 0, x: language === "fa" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-borderSoft bg-primary/80 p-6 shadow-[0_0_40px_rgba(0,212,255,0.12)] backdrop-blur-xl md:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-accent">{t("login", "panelTitle")}</p>
              <h2 className="text-2xl font-semibold text-white">{t("login", "panelSubtitle")}</h2>
            </div>
            <Link href="/" className="text-sm text-gray-400 transition hover:text-accent">
              {t("login", "backHome")}
            </Link>
          </div>

          <div className="space-y-4">
<div className="relative">
  <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />

  <input
    type="email"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    placeholder={t("login", "emailPlaceholder")}
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
    placeholder={t("login", "passwordPlaceholder")}
    className="w-full rounded-2xl border border-borderSoft bg-surface/70 py-3 pr-12 pl-12 text-white outline-none transition focus:border-accent"
    required
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-accent"
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5" />
    ) : (
      <Eye className="h-5 w-5" />
    )}
  </button>
</div>

            <div className="flex items-center justify-between gap-3 text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-borderSoft bg-surface" />
                <span>{t("login", "remember")}</span>
              </label>
              <Link
  href="/forgot-password"
  className="transition hover:text-accent"
>
  {t("login", "forgot")}
</Link>
            </div>

            <NeonButton type="submit" className="w-full justify-center">
              {t("login", "submit")}
            </NeonButton>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-400">
            {t("login", "helper")}
          </p>

          {isSubmitted && (
            <div className="mt-4 rounded-2xl border border-neonGreen/30 bg-neonGreen/10 px-4 py-3 text-sm text-neonGreen">
              {t("login", "success")}
            </div>
          )}
        </motion.form>
      </div>
    </main>
  );
}
