// types/index.ts

export type AnnouncementType = "WORKSHOP" | "WEBINAR" | "EVENT" | "NEWS";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: AnnouncementType;
  description: string;
  imageUrl?: string;
  isNew?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  authors: string[];
  year: number;
  readingTime: number;
  featured?: boolean;
  status?: ContentStatus;
  publishedAt?: string;
}

export interface Publication {
  id: string;
  slug: string;
  title: string;
  issue: string;
  date: string;
  category: string;
  summary: string;
  authors: string[];
  year: number;
  description: string;
  downloadUrl: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  role?: string;
  field?: string;
  monogram?: string;
  color?: string;
}

export interface Feedback {
  id: string;
  name?: string;
  email?: string;
  message: string;
  rating: number;
  date: string;
  approved?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  date?: string;
  category?: string;
  uploadedById?: string;
}

export interface ContactInfoItem {
  label: string;
  value: string;
  icon: "mail" | "phone" | "pin";
}
