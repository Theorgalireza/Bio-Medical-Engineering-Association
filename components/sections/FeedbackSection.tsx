"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import { StarIcon, CheckIcon } from "@/components/ui/Icons";
import { submitFeedback } from "@/lib/api";

const topics = ["پیشنهاد", "انتقاد", "سوال فنی", "همکاری"];

type FormState = {
  name: string;
  email: string;
  topic: string;
  rating: number;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  topic: topics[0],
  rating: 0,
  message: "",
};

export default function Feedback() {
  const [form, setForm] = useState<FormState>(initialState);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) {
      setError("ایمیل و پیام الزامی است.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      await submitFeedback({
        name: form.name || "ناشناس",
        message: form.message,
        rating: form.rating || 1,
      });
      setStatus("success");
      setForm(initialState);
      timeoutRef.current = window.setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setError("ارسال بازخورد ناموفق بود. دوباره تلاش کنید.");
      timeoutRef.current = window.setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="survey" className="relative py-24 bg-primary overflow-hidden">
      <CircuitBackground />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm text-accent tracking-widest">صدای شما</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            نظرسنجی و بازخورد
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full shadow-neon" />
          <p className="text-sm text-gray-400 mt-4 max-w-xl mx-auto leading-7">
            نظرات، پیشنهادها و انتقادهای شما به رشد انجمن کمک می‌کند. چند دقیقه وقت
            بگذارید و تجربه‌تون رو با ما در میان بذارید.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm p-6 md:p-10"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-14 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-neonGreen/10 border border-neonGreen/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(57,255,20,0.25)]">
                  <CheckIcon size={28} className="text-neonGreen" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  بازخورد شما ثبت شد
                </h3>
                <p className="text-sm text-gray-400">
                  از اینکه وقت گذاشتید سپاسگزاریم 🙏
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">
                      نام (اختیاری)
                    </label>
                    <input
                      type="text"
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
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => update("topic", t)}
                        className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                          form.topic === t
                            ? "bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                            : "border-borderSoft text-gray-400 hover:border-accent/40 hover:text-gray-200"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    امتیاز شما به تجربه‌ی انجمن
                  </label>
                  <div className="flex gap-1" dir="ltr">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => update("rating", n)}
                        className="text-gray-600 transition-colors duration-200"
                      >
                        <StarIcon
                          size={26}
                          filled={n <= (hoverRating || form.rating)}
                          className={
                            n <= (hoverRating || form.rating)
                              ? "text-accent drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]"
                              : "text-gray-700"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    پیام شما <span className="text-accent">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="نظر، پیشنهاد یا انتقاد خودتون رو بنویسید..."
                    className="w-full bg-primary/60 border border-borderSoft rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 resize-none focus:outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,212,255,0.12)] transition-all duration-300"
                  />
                </div>

                {status === "error" && error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full md:w-auto px-8 py-3 rounded-xl bg-accent text-primary font-bold text-sm shadow-[0_0_20px_rgba(0,212,255,0.35)] hover:shadow-[0_0_30px_rgba(0,212,255,0.55)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "در حال ارسال..." : "ارسال بازخورد"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
