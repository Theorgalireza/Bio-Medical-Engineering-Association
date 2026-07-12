"use client";

import { motion } from "framer-motion";

interface CircuitBackgroundProps {
  className?: string;
}

/**
 * Decorative animated circuit-line background used behind the contact form
 * and other sections for the "NeuroTech Lab" aesthetic.
 */
export default function CircuitBackground({
  className = "",
}: CircuitBackgroundProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Static circuit paths */}
      <g stroke="#1A2645" strokeWidth="1.5" opacity="0.5">
        <path d="M0 100 H200 V250 H400" />
        <path d="M800 150 H600 V300 H400" />
        <path d="M0 450 H150 V350 H400" />
        <path d="M800 500 H650 V400 H400" />
        <circle cx="200" cy="100" r="4" fill="#1A2645" />
        <circle cx="600" cy="150" r="4" fill="#1A2645" />
        <circle cx="150" cy="450" r="4" fill="#1A2645" />
        <circle cx="650" cy="500" r="4" fill="#1A2645" />
      </g>

      {/* Animated glowing pulse traveling along path */}
      <motion.path
        d="M0 100 H200 V250 H400"
        stroke="#00D4FF"
        strokeWidth="2"
        strokeDasharray="20 380"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -400 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="drop-shadow-[0_0_6px_#00D4FF]"
      />
      <motion.path
        d="M800 150 H600 V300 H400"
        stroke="#B026FF"
        strokeWidth="2"
        strokeDasharray="20 380"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -400 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        className="drop-shadow-[0_0_6px_#B026FF]"
      />
      <motion.path
        d="M0 450 H150 V350 H400"
        stroke="#39FF14"
        strokeWidth="2"
        strokeDasharray="20 380"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -400 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
        className="drop-shadow-[0_0_6px_#39FF14]"
      />
    </svg>
  );
}
