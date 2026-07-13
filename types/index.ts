// Shared TypeScript interfaces used across the project

export interface Announcement {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: "ورکشاپ" | "وبینار" | "رویداد" | "اطلاعیه";
  description: string;
  imageUrl?: string;
  isNew?: boolean;
}

export interface Publication {
  id: string;
  title: string;
  issue: string;
  date: string;
  category?: string;
  summary?: string;
  authors?: string[];
  year?: number;
  description: string;
  downloadUrl: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  specialties: string[];
}

export interface Feedback {
  id: string;
  name?: string;
  email?: string;
  message: string;
  rating: number; // 1 to 5
  date: string;
}
export interface ContactInfoItem {
  label: string;
  value: string;
  icon: "mail" | "phone" | "pin";
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
}


export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  date?: string; // اختیاری
  category?: string; // اختیاری
}

