"use client";

import { motion } from "framer-motion";

interface WaveformIconProps {
  className?: string;
  active?: boolean;
  size?: number;
  seed?: number;
}

// تولید یک عدد شبه‌تصادفی قطعی (deterministic) بر اساس seed
function seededRandom(seed: number, index: number) {
  const x = Math.sin(seed * 999 + index * 137.5) * 10000;
  return x - Math.floor(x);
}

// ساخت مسیر SVG موج بر اساس seed
function generateWavePath(seed: number = 0) {
  const points = 8;
  const width = 48;
  const step = width / points;
  let d = `M0 12`;

  for (let i = 1; i <= points; i++) {
    const x = Math.round(i * step);
    const rand = seededRandom(seed, i);
    const y = Math.round(4 + rand * 16); // بین 4 تا 20
    d += ` L${x} ${y}`;
  }

  return d;
}

export default function WaveformIcon({
  className = "",
  active = true,
  size = 24,
  seed = 0,
}: WaveformIconProps) {
  const path = generateWavePath(seed);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${active ? "text-accent" : "text-borderSoft"} ${className}`}
      animate={active ? { opacity: [0.7, 1, 0.7] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "drop-shadow-[0_0_4px_currentColor]" : ""}
      />
    </motion.svg>
  );
}
