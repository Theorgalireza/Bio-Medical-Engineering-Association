// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types";
import Spinner from "@/components/ui/Spinner";
import {
  Activity,
  BarChart2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Image,
  LayoutDashboard,
  Logs,
  Mail,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Users,
  X,
  Bell,
  Calendar,
  FileText,
  Video,
  Library,
} from "lucide-react";

type AdminNavItem = {
  href?: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: Role[];
  children?: AdminNavItem[];
};

const navGroups: AdminNavItem[] = [
  {
    href: "/admin",
    label: "داشبورد",
    icon: LayoutDashboard,
  },
  {
    label: "محتوا",
    icon: BookOpen,
    children: [
      { href: "/admin/articles", label: "مقالات و انتشارات", icon: FileText },
      { href: "/admin/announcements", label: "اعلان‌ها", icon: Megaphone },
    ],
  },
  {
    label: "رسانه‌ها",
    icon: Image,
    children: [
      { href: "/admin/gallery", label: "گالری تصاویر", icon: Image },
      { href: "/admin/videos", label: "ویدئوها", icon: Video },
      { href: "/admin/media", label: "آرشیو ها", icon: Library },
    ],
  },
  {
    label: "افراد",
    icon: Users,
    children: [
      { href: "/admin/faculty", label: "اعضای هیئت علمی", icon: Users },
      {
        href: "/admin/members",
        label: "اعضای انجمن",
        icon: Users,
        roles: ["OWNER", "ADMIN"],
      },
      
    ],
  },
  {
    label: "ارتباطات",
    icon: MessageSquare,
    children: [
      { href: "/admin/feedback", label: "بازخوردها", icon: MessageSquare },
      {
        href: "/admin/contacts",
        label: "تماس‌ها",
        icon: Mail,
        roles: ["OWNER", "ADMIN"],
      },
      { href: "/admin/newsletter", label: "خبرنامه", icon: Bell },
    ],
  },
  {
    label: "تحلیل",
    icon: BarChart2,
    children: [
      { href: "/admin/analytics", label: "آمار بازدید", icon: BarChart2 },
    ],
    roles: ["OWNER", "ADMIN"],
  },
  {
    label: "سیستم",
    icon: Settings,
    roles: ["OWNER", "ADMIN"],
    children: [
      { href: "/admin/logs", label: "لاگ فعالیت‌ها", icon: Logs, roles: ["OWNER"] },
      {
        href: "/admin/settings",
        label: "تنظیمات سایت",
        icon: Settings,
        roles: ["OWNER", "ADMIN"],
      },
      {
        href: "/admin/roles",
        label: "مدیریت نقش‌ها",
        icon: Shield,
        roles: ["OWNER"],
      },
    ],
  },
];

const ADMIN_ROLES = new Set<Role>(["OWNER", "ADMIN", "CONTENT_EDITOR"]);

function canAccess(item: AdminNavItem, role: Role): boolean {
  if (item.roles && !item.roles.includes(role)) return false;
  return true;
}

function NavItem({
  item,
  role,
  pathname,
  onNavigate,
}: {
  item: AdminNavItem;
  role: Role;
  pathname: string;
  onNavigate?: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const visibleChildren = hasChildren
    ? item.children!.filter((c) => canAccess(c, role))
    : [];

  const isChildActive = visibleChildren.some((c) => c.href === pathname);
  const [open, setOpen] = useState(isChildActive);

  if (!canAccess(item, role)) return null;
  if (hasChildren && visibleChildren.length === 0) return null;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          <item.icon size={16} />
          <span className="flex-1 text-right">{item.label}</span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <div className="mr-4 mt-1 border-r border-white/10 pr-2 space-y-1">
            {visibleChildren.map((child) => (
              <NavItem
                key={child.href}
                item={child}
                role={role}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href!}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff]"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <item.icon size={16} />
      <span>{item.label}</span>
    </Link>
  );
}

function Sidebar({
  role,
  pathname,
  onNavigate,
}: {
  role: Role;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-white/10">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Activity size={20} className="text-[#00d4ff]" />
        <span className="font-bold text-white text-sm">پنل مدیریت</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navGroups.map((group, i) => (
          <NavItem
            key={group.href ?? group.label ?? i}
            item={group}
            role={role}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (!ADMIN_ROLES.has(user.role as Role)) router.replace("/");
  }, [user, loading, router]);

  if (loading || !user || !ADMIN_ROLES.has(user.role as Role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 h-screen w-64 z-40">
        <Sidebar role={user.role as Role} pathname={pathname} />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-screen w-64 z-50 lg:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Sidebar
          role={user.role as Role}
          pathname={pathname}
          onNavigate={() => setSidebarOpen(false)}
        />
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main */}
      <div className="lg:mr-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-medium text-gray-200">
            پنل مدیریت انجمن مهندسی پزشکی
          </span>
          <span className="flex items-center gap-2 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            آنلاین
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
