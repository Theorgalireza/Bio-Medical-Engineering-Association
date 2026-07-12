"use client";

import { motion } from "framer-motion";

interface NeuroLogoProps {
  size?: number;
}

// Eight nodes placed around the ring, each with its own pulse delay so the
// glow reads as traveling current rather than a single synchronized blink.
const ringNodes = [0, 45, 90, 135, 180, 225, 270, 315];

export default function NeuroLogo({ size = 320 }: NeuroLogoProps) {
  return (
    <div
      className="relative mx-auto"
      style={{ width: size, height: size }}
      role="img"
      aria-label="نشان انجمن علمی بیوالکتریک: مدار نئونی دور یک طرح انتزاعی مغز و موج زیستی"
    >
      {/* Outer rotating circuit ring */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full text-accent/80"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 8"
          opacity="0.5"
        />
        {/* short PCB-style branch ticks */}
        {ringNodes.map((angle) => (
          <line
            key={`tick-${angle}`}
            x1="100"
            y1="6"
            x2="100"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.6"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
      </motion.svg>

      {/* Glowing nodes (counter-rotating stays fixed visually via own animation) */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        {ringNodes.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 92 * Math.sin(rad);
          const cy = 100 - 92 * Math.cos(rad);
          return (
            <circle
              key={`node-${angle}`}
              cx={cx}
              cy={cy}
              r={3.2}
              className="fill-accent animate-pulseNode"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          );
        })}
      </svg>

      {/* Abstract brain silhouette */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-signal">
        <path
          d="M100 44
             C 76 44 60 58 56 76
             C 40 78 30 92 32 108
             C 24 114 22 128 30 138
             C 34 150 48 158 62 156
             C 68 164 80 168 92 164
             C 100 170 118 170 126 162
             C 140 164 154 154 156 140
             C 168 134 172 118 162 106
             C 168 92 158 76 142 74
             C 138 58 120 44 100 44 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.55"
        />
      </svg>

      {/* Traveling EEG waveform across the center */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-electric">
        <path
          d="M30 100 H62 L72 78 L86 122 L98 66 L108 100 H128 L136 112 L146 88 L156 100 H172"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="240"
          className="animate-flowDash"
        />
      </svg>

      {/* Center monogram */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-borderSoft bg-surface/90 shadow-glowAccent">
          <span className="font-mono text-base font-bold leading-none text-accent">BE</span>
          <span className="mt-1 font-mono text-[8px] tracking-widest text-inkMuted">NEURO</span>
        </div>
      </div>
    </div>
  );
}
