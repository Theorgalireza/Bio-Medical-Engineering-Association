"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import { MailIcon, PhoneIcon, PinIcon, SendIcon, CheckIcon } from "@/components/ui/Icons";
import { contactInfo } from "@/data/mockData";
import { useLanguage } from "@/lib/LanguageContext";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const infoIcons = {
  mail: MailIcon,
  phone: PhoneIcon,
  pin: PinIcon,
} as const;

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState<ContactForm>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const update = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("done");
    setForm(initialState);

    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id="contact" className="relative py-24 bg-surface overflow-hidden">
      <CircuitBackground />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-accent tracking-widest">{t("contact", "label")}</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            {t("contact", "title")}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full shadow-neon" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info) => {
              const Icon = infoIcons[info.icon as keyof typeof infoIcons] ?? MailIcon;
              return (
                <div
                  key={info.label}
                  className="flex items-start gap-4 rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm p-5 hover:border-accent/50 transition-colors duration-300"
                >
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{info.label}</p>
                    <p className="text-sm text-white font-medium" dir="ltr">
                      {info.value}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* map placeholder - synthetic circuit-grid style, no external tiles */}
            <div className="relative rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm h-48 overflow-hidden flex items-center justify-center">
              <CircuitBackground />
              <div className="relative flex flex-col items-center gap-2 text-center">
                <PinIcon size={26} className="text-accent drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                <span className="text-xs text-gray-400">
                  دانشکده مهندسی برق، دانشگاه ...
                </span>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 relative rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-neonGreen/10 border border-neonGreen/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(57,255,20,0.25)]">
                    <CheckIcon size={28} className="text-neonGreen" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">پیام شما ارسال شد</h3>
                  <p className="text-sm text-gray-400">
                    در اسرع وقت با شما تماس می‌گیریم.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">
                        نام و نام‌خانوادگی <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="نام شما"
                        className="w-full bg-primary/60 border border-borderSoft rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">
                        ایمیل <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-primary/60 border border-borderSoft rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">موضوع</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      placeholder="موضوع پیام"
                      className="w-full bg-primary/60 border border-borderSoft rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)] transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      پیام <span className="text-accent">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      className="w-full bg-primary/60 border border-borderSoft rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 resize-none focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)] transition-all duration-300"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-accent text-primary font-bold text-sm shadow-[0_0_20px_rgba(0,212,255,0.35)] hover:shadow-[0_0_30px_rgba(0,212,255,0.55)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      "در حال ارسال..."
                    ) : (
                      <>
                        <SendIcon size={16} />
                        ارسال پیام
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
