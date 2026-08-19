"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setLoading(true);
    try {
      await forgotPassword(identifier.trim());
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 pb-16 pt-24">
      <div className="mx-auto max-w-xl">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-borderSoft bg-primary/80 p-8 shadow-[0_0_40px_rgba(0,212,255,0.12)] backdrop-blur-xl"
        >
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm text-accent">
              بازیابی حساب
            </div>

            <h1 className="text-3xl font-bold text-white">
              فراموشی رمز عبور
            </h1>

            <p className="mt-3 leading-8 text-gray-400">
              ایمیل یا شماره موبایل خود را وارد کنید تا در صورت وجود حساب، لینک بازیابی
              رمز عبور برای شما ارسال شود.
            </p>
          </div>

          {!isSubmitted ? (
            <>
              <label className="block space-y-2 text-sm text-gray-300">
                ایمیل یا شماره موبایل
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent" />
                  <input
                    type="text"
                    inputMode="email"
                    required
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="example@sbu.ac.ir یا ۰۹۱۲..."
                    className="w-full rounded-2xl border border-borderSoft bg-surface/70 py-3 pl-12 pr-4 text-white outline-none transition focus:border-accent"
                  />
                </div>
              </label>

              <NeonButton
                type="submit"
                className="mt-6 w-full justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  "ارسال لینک بازیابی"
                )}
              </NeonButton>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-400 transition hover:text-accent"
                >
                  ← بازگشت به ورود
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neonGreen/30 bg-neonGreen/10 text-4xl">
                <CheckCircle2
  className="h-16 w-16 text-neonGreen"
/>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  لینک ارسال شد
                </h2>

                <p className="mt-3 leading-8 text-gray-400">
                  اگر این ایمیل در سامانه ثبت شده باشد،
                  لینک بازیابی رمز عبور برای شما ارسال خواهد شد.
                </p>
              </div>

              <NeonButton href="/login" className="w-full justify-center">بازگشت به ورود</NeonButton>
            </motion.div>
          )}
        </motion.form>
      </div>
    </main>
  );
}
