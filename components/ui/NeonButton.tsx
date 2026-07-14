"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}

type LinkProps = BaseProps &
  Omit<HTMLMotionProps<"a">, "children" | "className" | "href"> & {
    href: string;
  };

type ButtonProps = BaseProps &
  Omit<HTMLMotionProps<"button">, "children" | "className"> & {
    href?: never;
  };

type NeonButtonProps = LinkProps | ButtonProps;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-semibold text-sm md:text-base transition-all duration-300 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60";

function getVariantStyles(variant: "primary" | "outline") {
  return variant === "primary"
    ? "bg-accent text-primary shadow-neon hover:shadow-[0_0_16px_rgba(0,212,255,0.9),0_0_40px_rgba(0,212,255,0.5)]"
    : "bg-primary/80 backdrop-blur-sm border-2 border-accent text-accent hover:bg-accent/10 hover:shadow-neon";
}

function isLink(props: NeonButtonProps): props is LinkProps {
  return typeof (props as LinkProps).href === "string";
}

export default function NeonButton(props: NeonButtonProps) {
  const styles = `${baseStyles} ${getVariantStyles(
    props.variant ?? "primary"
  )} ${props.className ?? ""}`;

  if (isLink(props)) {
    const {
      children,
      variant,
      className,
      href,
      ...linkProps
    } = props;

    if (href.startsWith("#")) {
      return (
        <motion.a
          href={href}
          className={styles}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          {...linkProps}
        >
          {children}
        </motion.a>
      );
    }

    return (
      <Link href={href} className={styles}>
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2"
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  const {
    children,
    variant,
    className,
    ...buttonProps
  } = props;

  return (
    <motion.button
      type={buttonProps.type ?? "button"}
      className={styles}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}