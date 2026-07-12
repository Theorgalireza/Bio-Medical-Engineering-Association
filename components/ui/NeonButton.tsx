"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline";
}

export default function NeonButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: NeonButtonProps) {
  const baseStyles =
    "relative px-8 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 overflow-hidden";

  const variantStyles =
    variant === "primary"
      ? "bg-accent text-primary shadow-neon hover:shadow-[0_0_16px_rgba(0,212,255,0.9),0_0_40px_rgba(0,212,255,0.5)]"
      : "bg-primary/80 backdrop-blur-sm border-2 border-accent text-accent hover:bg-accent/10 hover:shadow-neon";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}
