"use client";

import { motion } from "framer-motion";
import { publications } from "@/data/mockData";

// Synthetic cover: waveform + circuit pattern combo, generated purely with SVG/CSS (no external images)
function SyntheticCover({ seed }: { seed: number }) {
  const hueA = (seed * 47) % 360;
  return (
    <div
      className="relative w-full h-40 rounded-t-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #0B1530 0%, #050A18 100%)`,
      }}
    >
      <svg viewBox="0 0 300 160" className="absolute inset-0 w-full h-full opacity-70">
        <defs>
          <pattern
            id={`circuit-${seed}`}
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path d="M0 15 H30 M15 0 V30" stroke="#1A2645" strokeWidth="1" />
            <circle cx="15" cy="15" r="1.5" fill="#00D4FF" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#circuit-${seed})`} />
        <path
          d={`M0 80 H60 L75 ${40 + (seed % 30)} L90 ${120 - (seed % 40)} L105 80 H150 L165 ${
            30 + (seed % 50)
          } L180 ${130 - (seed % 30)} L195 80 H300`}
          fill="none"
          stroke="#7DF9FF"
          strokeWidth="2"
          className="drop-shadow-[0_0_6px_#7DF9FF]"
        />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 30%, hsla(${hueA}, 90%, 60%, 0.15), transparent 60%)`,
        }}
      />
    </div>
  );
}

export default function Publications() {
  return (
    <section
      id="publications"
      className="relative py-24 bg-primary overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-accent tracking-widest">
            پژوهش و انتشارات
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            نشریات و مقالات علمی
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full shadow-neon" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1200px]">
          {publications.map((pub, idx) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ rotateX: 4, rotateY: -6, scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
              className="rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm overflow-hidden transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(0,212,255,0.15)]"
            >
              <SyntheticCover seed={idx} />

              <div className="p-6">
                <span className="text-xs text-signal">{pub.category}</span>
                <h3 className="text-base font-bold text-white mt-2 mb-2 leading-7 line-clamp-2">
                  {pub.title}
                </h3>
                <p className="text-sm text-gray-400 leading-6 mb-4 line-clamp-2">
                  {pub.summary}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-borderSoft pt-3">
                  <span>{pub.authors?.join("، ") || "نامشخص"}</span>
                  <span className="text-electric">{pub.year}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
