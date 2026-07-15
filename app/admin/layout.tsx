"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Activity,
  BookOpen,
  LayoutDashboard,
  Mail,
  Megaphone,
  Menu,
  MessageSquare,
  Users,
  X,
} from "lucide-react";

import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

type AdminNavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: Role[];
};

const navItems: AdminNavItem[] = [
  {
    href: "/admin",
    label: "داشبورد",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/announcements",
    label: "اعلان‌ها",
    icon: Megaphone,
  },
  {
    href: "/admin/articles",
    label: "مقالات",
    icon: BookOpen,
  },
  {
    href: "/admin/faculty",
    label: "اعضای هیئت علمی",
    icon: Users,
  },
  {
    href: "/admin/members",
    label: "اعضای انجمن",
    icon: Users,
    roles: ["OWNER", "ADMIN"],
  },
  {
    href: "/admin/feedback",
    label: "بازخوردها",
    icon: MessageSquare,
  },
  {
    href: "/admin/contacts",
    label: "تماس‌ها",
    icon: Mail,
    roles: ["OWNER", "ADMIN"],
  },
];

const ADMIN_ROLES = new Set<Role>([
  "OWNER",
  "ADMIN",
  "CONTENT_EDITOR",
]);

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const canAccessAdmin =
    !!user && ADMIN_ROLES.has(user.role);

  useEffect(() => {
    if (!loading && !canAccessAdmin) {
      router.replace(user ? "/" : "/login");
    }
  }, [loading, canAccessAdmin, router, user]);

  if (loading || !canAccessAdmin) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#0a0f1e]"
      >
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0a0f1e] text-white"
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}      {/* =========================
            Desktop Sidebar
      ========================== */}
      <aside className="hidden lg:flex fixed right-0 top-0 z-30 h-screen w-64 flex-col border-l border-[#1e2d4a] bg-[#0d1526]">

        <div className="flex h-16 items-center gap-2 border-b border-[#1e2d4a] px-5">
          <Activity
            size={20}
            className="text-[#00d4ff]"
          />

          <span className="font-bold text-[#00d4ff]">
            پنل مدیریت
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems
            .filter(
              item =>
                !item.roles ||
                (user && item.roles.includes(user.role))
            )
            .map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    flex items-center gap-3
                    rounded-xl
                    px-4
                    py-3
                    transition-all

                    ${
                      active
                        ? "bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>{label}</span>
                </Link>
              );
            })}
        </nav>
      </aside>

      {/* =========================
            Mobile Drawer
      ========================== */}

      <aside
        className={`
          fixed
          top-0
          right-0
          z-50
          h-screen
          w-64
          bg-[#0d1526]
          border-l
          border-[#1e2d4a]
          flex
          flex-col
          transition-transform
          duration-300
          lg:hidden

          ${
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#1e2d4a] px-5">

          <div className="flex items-center gap-2">
            <Activity
              size={20}
              className="text-[#00d4ff]"
            />

            <span className="font-bold text-[#00d4ff]">
              پنل مدیریت
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems
            .filter(
              item =>
                !item.roles ||
                (user && item.roles.includes(user.role))
            )
            .map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3
                    rounded-xl
                    px-4
                    py-3
                    transition-all

                    ${
                      active
                        ? "bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>{label}</span>
                </Link>
              );
            })}
        </nav>
      </aside>      {/* =========================
            Main Content
      ========================== */}

      <div className="flex min-h-screen flex-col lg:mr-64">

        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#1e2d4a] bg-[#0d1526]/95 px-6 backdrop-blur-md">

          <div className="flex items-center gap-3">

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 transition hover:bg-white/5 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h1 className="font-vazir text-sm font-semibold tracking-tight text-gray-300">
              پنل مدیریت انجمن مهندسی پزشکی
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-xs text-gray-400">
              آنلاین
            </span>

          </div>

        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>    </div>
  );
}