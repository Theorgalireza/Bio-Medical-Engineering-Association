"use client";

import { motion } from "framer-motion";

interface WaveformIconProps {
  className?: string;
  active?: boolean;
  size?: number;
}

export default function WaveformIcon({
  className = "",
  active = true,
  size = 24,
}: WaveformIconProps) {
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
        d="M0 12 H8 L11 3 L15 21 L19 8 L22 16 L25 12 H48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={active ? "drop-shadow-[0_0_4px_currentColor]" : ""}
      />
    </motion.svg>
  );
}
