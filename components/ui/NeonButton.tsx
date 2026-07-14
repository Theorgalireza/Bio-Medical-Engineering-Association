"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

type ButtonProps = BaseProps &
  Omit<HTMLMotionProps<"button">, "children" | "className"> & {
    href?: undefined;
  };

type LinkProps = BaseProps &
  Omit<HTMLMotionProps<"a">, "children" | "className" | "href"> & {
    href: string;
  };

type NeonButtonProps = ButtonProps | LinkProps;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-sm md:text-base transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60";

function getVariantStyles(variant: "primary" | "outline") {
  return variant === "primary"
    ? "bg-accent text-primary shadow-neon hover:shadow-[0_0_16px_rgba(0,212,255,0.9),0_0_40px_rgba(0,212,255,0.5)]"
    : "bg-primary/80 backdrop-blur-sm border-2 border-accent text-accent hover:bg-accent/10 hover:shadow-neon";
}

export default function NeonButton(props: NeonButtonProps) {
  const {
    children,
    variant = "primary",
    className = "",
    href,
    ...rest
  } = props;

  const styles = `${baseStyles} ${getVariantStyles(variant)} ${className}`.trim();

  // ---------- Link ----------
  if (href) {
    // Anchor link (#contact)
    if (href.startsWith("#")) {
      return (
        <motion.a
          href={href}
          className={styles}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {children}
        </motion.a>
      );
    }

    // Internal/External link
    return (
      <Link href={href} className={styles}>
        <motion.span
          className="inline-flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  // ---------- Button ----------
  return (
    <motion.button
      {...(rest as HTMLMotionProps<"button">)}
      type={(rest as HTMLMotionProps<"button">).type ?? "button"}
      className={styles}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}