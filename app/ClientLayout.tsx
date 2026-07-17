"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { trackPageView } from "@/lib/api";
import type { SiteSettings } from "@/lib/site-settings";

export default function ClientLayout({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    // شکست ثبت آمار نباید ناوبری کاربر را مختل کند
    void trackPageView(pathname).catch(() => {});
  }, [pathname]);

  return (
    <>
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
