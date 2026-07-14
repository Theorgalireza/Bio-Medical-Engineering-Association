import type { Role } from "@/types";

export const ROLE_LABELS: Record<Role, string> = {
  OWNER: "مالک انجمن",
  ADMIN: "مدیر سیستم",
  CONTENT_EDITOR: "ویراستار محتوا",
  STUDENT_MEMBER: "عضو دانشجویی",
  STUDENT_ACTIVE_MEMBER: "عضو فعال دانشجویی",
  STUDENT_INACTIVE_MEMBER: "عضو غیرفعال دانشجویی",
  FACULTY_MEMBER: "عضو هیئت علمی",
  GUEST: "مهمان",
};

export const ROLE_COLORS: Record<Role, string> = {
  OWNER: "bg-neonPurple/15 text-neonPurple border-neonPurple/40",
  ADMIN: "bg-accent/15 text-accent border-accent/40",
  CONTENT_EDITOR: "bg-electric/15 text-electric border-electric/40",
  STUDENT_MEMBER: "bg-signal/15 text-signal border-signal/40",
  STUDENT_ACTIVE_MEMBER: "bg-neonGreen/15 text-neonGreen border-neonGreen/40",
  STUDENT_INACTIVE_MEMBER: "bg-gray-500/15 text-gray-400 border-gray-500/40",
  FACULTY_MEMBER: "bg-electric/15 text-electric border-electric/40",
  GUEST: "bg-gray-500/15 text-gray-400 border-gray-500/40",
};
