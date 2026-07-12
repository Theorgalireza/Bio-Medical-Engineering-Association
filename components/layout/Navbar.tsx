"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveformIcon from "@/components/ui/WaveformIcon";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, t } = useLanguage();

  const navLinks = [
    { label: t("nav", "home"), href: "#home" },
    { label: t("nav", "announcements"), href: "#announcements" },
    { label: t("nav", "articles"), href: "/articles" },
    { label: t("nav", "faculty"), href: "#faculty" },
    { label: t("nav", "survey"), href: "#survey" },
    { label: t("nav", "contact"), href: "#contact" },
  ];

  const authLink = { label: language === "fa" ? "ورود" : "Login", href: "/login" };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-xl border-b border-accent/20 shadow-[0_8px_32px_rgba(0,212,255,0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <WaveformIcon size={28} className="group-hover:animate-pulseGlow" />
          <span className="text-lg md:text-xl font-bold text-white leading-tight">
            <span className="hidden sm:inline">
              {t("hero", "title")} <span className="text-accent text-glow">{t("hero", "subtitle")}</span>
            </span>
            <span className="inline sm:hidden">
              {language === "en" ? "BME Assoc." : "انجمن BME"}
            </span>
          </span>
        </a>

        {/* Desktop Links + Language Toggle */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative text-sm text-gray-300 hover:text-accent transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 right-0 w-0 h-[1.5px] bg-accent shadow-neon transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={authLink.href}
                className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/20"
              >
                {authLink.label}
              </Link>
            </li>
          </ul>
          <LanguageToggle />
        </div>

        {/* Mobile Menu Toggle + Language Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="باز کردن منو"
          >
            <span
              className={`block w-6 h-0.5 bg-accent transition-transform duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-accent transition-opacity duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-accent transition-transform duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-primary/95 backdrop-blur-md border-t border-borderSoft"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-gray-300 hover:text-accent transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={authLink.href}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
                >
                  {authLink.label}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
