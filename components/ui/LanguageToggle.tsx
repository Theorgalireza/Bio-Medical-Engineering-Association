"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === "en" ? "fa" : "en")}
      className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-200 text-sm font-semibold text-accent border border-accent/30"
      aria-label="تغییر زبان"
    >
      <span>{language === "en" ? "EN" : "FA"}</span>
      <div className="w-1 h-1 rounded-full bg-accent" />
      <span className="text-xs text-gray-400">
        {language === "en" ? "فارسی" : "English"}
      </span>
    </motion.button>
  );
}
