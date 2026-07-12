"use client";

import { useState } from "react";

interface WaveformRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const scale = [1, 2, 3, 4, 5];

export default function WaveformRating({ value, onChange }: WaveformRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="امتیاز شما از ۱ تا ۵">
      {scale.map((n) => {
        const isActive = n <= active;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`امتیاز ${n} از ۵`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(n)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? "scale-110 border-accent/70 bg-accent/10 shadow-glowAccent"
                : "border-borderSoft bg-primary/40"
            }`}
          >
            <svg viewBox="0 0 24 24" className={`h-5 w-5 ${isActive ? "text-accent" : "text-inkMuted"}`}>
              <path
                d="M1 12h4l2-6 3 12 2.5-9 2 6h8.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
