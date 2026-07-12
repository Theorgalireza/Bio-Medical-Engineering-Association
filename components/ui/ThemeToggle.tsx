"use client";

import { useTheme } from "@/app/ThemeProvider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg border border-borderSoft w-5 h-5" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-borderSoft hover:border-accent/50 hover:bg-primaryLight/20 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="تغییر تم"
    >
      {theme === "dark" ? (
        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm0 10a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 100-4 2 2 0 000 4zm.464-7.207a1 1 0 10-1.414-1.414l-1.414 1.414a1 1 0 101.414 1.414l1.414-1.414zm2.828 2.828a1 1 0 101.414-1.414l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414zm2.828 2.828a1 1 0 100-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414zm-2.828 2.828a1 1 0 101.414 1.414l1.414-1.414a1 1 0 11-1.414-1.414l-1.414 1.414zM16.5 5.5a1 1 0 11-1.414-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414zM13 2.5a1 1 0 110-2h2a1 1 0 110 2h-2z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </motion.button>
  );
}
