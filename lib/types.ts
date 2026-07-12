export type AnnouncementType =
  | "workshop"
  | "webinar"
  | "competition"
  | "call_for_papers"
  | "tour"
  | "other";

export interface Announcement {
  id: string;
  title: string;
  date: string; // Jalali display string, e.g. "۱۴۰۳/۰۹/۱۲"
  type: AnnouncementType;
  description: string;
  isNew?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  issue: string; // e.g. "شماره ۷"
  date: string;
  description: string;
  pdfUrl?: string;
  accentColor: "accent" | "electric" | "signal" | "neonPurple" | "neonGreen";
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string; // استاد، دانشیار، استادیار
  specialties: string[];
  profileUrl?: string;
  scholarUrl?: string;
  researchGateUrl?: string;
  signalTint: "accent" | "electric" | "signal" | "neonPurple" | "neonGreen";
}

export interface Feedback {
  id: string;
  name?: string;
  rating: number; // 1–5
  message: string;
  createdAt: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export const ANNOUNCEMENT_TYPE_LABEL: Record<AnnouncementType, string> = {
  workshop: "ورکشاپ",
  webinar: "وبینار",
  competition: "مسابقه",
  call_for_papers: "فراخوان مقاله",
  tour: "تور علمی",
  other: "رویداد",
};
