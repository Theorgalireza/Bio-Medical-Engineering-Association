"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveformIcon from "@/components/ui/WaveformIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user, loading, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: "خانه", href: "/#home" },
    { label: "اعلامیه‌ها", href: "/#announcements" },
    { label: "مقالات", href: "/articles" },
    { label: "هیئت علمی", href: "/#faculty" },
    { label: "نظرسنجی", href: "/#survey" },
    { label: "ارتباط با ما", href: "/#contact" },
  ];

  const authLink = { label: "ورود / ثبت‌نام", href: "/login" };

  const isAdminRole =
    user?.role === "OWNER" || user?.role === "ADMIN" || user?.role === "CONTENT_EDITOR";

  const displayName =
    user?.profile?.firstName || user?.profile?.lastName
      ? `${user?.profile?.firstName ?? ""} ${user?.profile?.lastName ?? ""}`.trim()
      : user?.email || user?.phone || "کاربر";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // بستن dropdown پروفایل با کلیک بیرون از آن
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-primary/90 backdrop-blur-md border-b border-borderSoft shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <WaveformIcon />
          <span className="text-lg font-bold text-white">انجمن مهندسی پزشکی</span>
        </Link>

        {/* منوی دسکتاپ */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm text-gray-300 hover:text-accent transition-colors duration-200"
            >
              {link.label}
              <span className="absolute -bottom-1 right-0 h-0.5 w-0 bg-accent shadow-neon transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {/* بخش auth دسکتاپ */}
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-borderSoft" />
          ) : isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 py-1.5 pl-3 pr-1.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="آواتار"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                </span>
                <span className="max-w-[110px] truncate">{displayName}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-52 overflow-hidden rounded-xl border border-borderSoft bg-primaryLight shadow-xl"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      <User size={16} />
                      پروفایل من
                    </Link>
                    {isAdminRole && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-200 hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        پنل مدیریت
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-borderSoft px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      خروج از حساب
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={authLink.href}
              className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
            >
              {authLink.label}
            </Link>
          )}
        </div>

        {/* دکمه hamburger موبایل */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="منو"
        >
          <span className={`h-0.5 w-6 bg-accent transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-accent transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-accent transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* منوی موبایل */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-primary/95 backdrop-blur-md border-t border-borderSoft"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-accent/10 hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}

              {loading ? (
                <div className="mt-2 h-10 w-full animate-pulse rounded-full bg-borderSoft" />
              ) : isAuthenticated ? (
                <div className="mt-2 flex flex-col gap-1 border-t border-borderSoft pt-3">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="آواتار" className="h-full w-full object-cover" />
                      ) : (
                        <User size={16} />
                      )}
                    </span>
                    <span className="truncate">{displayName}</span>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-accent/10 hover:text-accent"
                  >
                    <User size={16} />
                    پروفایل من
                  </Link>
                  {isAdminRole && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-accent/10 hover:text-accent"
                    >
                      <LayoutDashboard size={16} />
                      پنل مدیریت
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    خروج از حساب
                  </button>
                </div>
              ) : (
                <Link
                  href={authLink.href}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
                >
                  {authLink.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
