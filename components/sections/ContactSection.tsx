"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import { MailIcon, PhoneIcon, PinIcon, CheckIcon, SendIcon } from "@/components/ui/Icons";
import { submitContact } from "@/lib/api";
import type { SiteSettings } from "@/lib/site-settings";

type ContactForm = { name: string; email: string; subject: string; message: string };
const initialState: ContactForm = { name: "", email: "", subject: "", message: "" };

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = useState<ContactForm>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const update = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => () => { if (timeoutRef.current) window.clearTimeout(timeoutRef.current); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("نام، ایمیل و پیام الزامی است.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm(initialState);
      timeoutRef.current = window.setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setError("ارسال پیام ناموفق بود. دوباره تلاش کنید.");
      timeoutRef.current = window.setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const contactItems = [
    { label: "ایمیل", value: settings.contact_email, Icon: MailIcon },
    { label: "تلفن", value: settings.contact_phone, Icon: PhoneIcon },
    { label: "آدرس", value: settings.contact_address, Icon: PinIcon },
  ].filter((i) => i.value);

  return (
    <section id="contact" className="relative py-24 bg-surface overflow-hidden">
      <CircuitBackground />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-accent tracking-widest">در تماس باشید</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">ارتباط با انجمن</h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full shadow-neon" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactItems.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-borderSoft bg-primaryLight/60 p-4 backdrop-blur-sm">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{label}</h3>
                  <p className="mt-1 text-sm leading-7 text-gray-400">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-2xl border border-borderSoft bg-primaryLight/60 p-6 backdrop-blur-sm md:p-8"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                  className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-neonGreen/40 bg-neonGreen/10 text-neonGreen">
                    <CheckIcon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-white">پیام شما ثبت شد</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-400">به‌زودی پاسخ شما را بررسی می‌کنیم.</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="نام"
                      className="w-full rounded-xl border border-borderSoft bg-primary/60 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-accent" />
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="ایمیل"
                      className="w-full rounded-xl border border-borderSoft bg-primary/60 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-accent" />
                  </div>
                  <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="موضوع"
                    className="w-full rounded-xl border border-borderSoft bg-primary/60 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-accent" />
                  <textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="پیام شما" rows={6}
                    className="w-full rounded-xl border border-borderSoft bg-primary/60 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-accent" />
                  {status === "error" && error && <p className="text-sm text-red-400">{error}</p>}
                  <button type="submit" disabled={status === "submitting"}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                    <SendIcon size={18} />
                    {status === "submitting" ? "در حال ارسال..." : "ارسال پیام"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
