"use client";

import { motion } from "framer-motion";
import NeonButton from "@/components/ui/NeonButton";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-b from-primary via-[#081027] to-surface"
    >
      {/* Background animated PCB grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="pcb-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 30 H60 M30 0 V60"
                stroke="#1A2645"
                strokeWidth="1"
              />
              <circle cx="30" cy="30" r="2" fill="#1A2645" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pcb-grid)" />
        </svg>
      </div>

      {/* Glowing radial blobs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-neonPurple/20 rounded-full blur-[120px]" />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Logo: Heart silhouette + ECG wave + unified rotating circuit rings */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative mb-8 w-40 h-40 md:w-48 md:h-48"
        >
          {/* Unified rotating circuit ring — single continuous line */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <filter id="hero-ring-glow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M100 10
                 a90 90 0 1 1 0 180
                 a90 90 0 1 1 0 -180"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#hero-ring-glow)"
            />

            {/* Electrons traveling around the ring */}
            <motion.g
              style={{ transformOrigin: "100px 100px" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="100" cy="10" r="3" fill="#7DF9FF" />
            </motion.g>
            <motion.g
              style={{ transformOrigin: "100px 100px" }}
              initial={{ rotate: 180 }}
              animate={{ rotate: -180 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="100" cy="10" r="3" fill="#7DF9FF" />
            </motion.g>
          </motion.svg>

          {/* Heartbeat silhouette + ECG wave inside (per reference image) */}
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full p-8"
          >
            {/* Anatomical heart outline */}
            <path
              d="M100 158
                 C70 132 30 104 30 68
                 C30 44 48 28 70 28
                 C84 28 96 35 100 47
                 C104 35 116 28 130 28
                 C152 28 170 44 170 68
                 C170 104 130 132 100 158 Z"
              fill="none"
              stroke="#7DF9FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_10px_#7DF9FF]"
            />

            {/* ECG waveform passing through the heart */}
            <motion.path
              d="M32 90 H62 L72 60 L82 118 L92 78 L100 90 L108 78 L118 118 L128 60 L138 90 H168"
              fill="none"
              stroke="#00D4FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_12px_#00D4FF]"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4"
        >
         <span className="text-neonPurple drop-shadow-[0_0_12px_rgba(176,38,255,0.8)]">
    انجمن علمی
  </span>
          <span className="text-accent text-glow"> مهندسی پزشکی</span>
          <br />

          دانشگاه شهید بهشتی تهران
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base md:text-lg text-gray-400 max-w-2xl mb-8 leading-8"
        >
         دانشگاه شهید بهشتی — جایی برای پژوهش، یادگیری و نوآوری در حوزه سیگنال‌های زیستی، رابط‌های مغز-رایانه (BCI) و علوم اعصاب محاسباتی.
        </motion.p>

        {/* Animated ECG waveform strip - positioned below description, above buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-2xl h-16 md:h-20 mb-8"
        >
          <svg
            viewBox="0 0 1200 120"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 60 H100 L120 20 L140 100 L160 40 L180 80 L200 60 H350 L370 10 L390 110 L410 60 H600 L620 30 L640 90 L660 60 H900 L920 20 L940 100 L960 60 H1200"
              fill="none"
              stroke="#7DF9FF"
              strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="drop-shadow-[0_0_10px_#7DF9FF]"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <NeonButton href="#announcements">مشاهده اعلامیه‌ها</NeonButton>
          <NeonButton href="#contact" variant="outline">عضویت در انجمن</NeonButton>
        </motion.div>
      </div>
    </section>
  );
}
