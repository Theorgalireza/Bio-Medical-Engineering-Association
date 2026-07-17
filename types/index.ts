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
  date: string;
  year: number;
  readingTime: number;
  featured?: boolean;
  status?: ContentStatus;
  publishedAt?: string;
  issue?: string;
  downloadUrl?: string;
  description?: string;
}

export interface ActivityLog {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  detail: string | null;
  ip: string | null;
  createdAt: string;
}

export interface ActivityLogsResponse {
  data: ActivityLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export type Role =
  | "OWNER"
  | "ADMIN"
  | "CONTENT_EDITOR"
  | "STUDENT_MEMBER"
  | "STUDENT_ACTIVE_MEMBER"
  | "STUDENT_INACTIVE_MEMBER"
  | "FACULTY_MEMBER"
  | "GUEST";

export interface Profile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  studentId?: string | null;
  university?: string | null;
  major?: string | null;
  field?: string | null;
  entryYear?: number | null;
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
  profileEmail?: string | null;
}

export interface CurrentUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string | null;
  profile: Profile | null;
}

export interface ApiUser {
  id: string;
  email: string | null;
  phone: string | null;
  avatarUrl?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}

export interface CreateUserPayload {
  email?: string;
  phone?: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  university?: string;
  major?: string;
  field?: string;
  entryYear?: number;
  github?: string;
  linkedin?: string;
  website?: string;
  profileEmail?: string;
}

export interface UpdateProfilePayload {
  firstName?: string | null;
  lastName?: string | null;
  studentId?: string | null;
  university?: string | null;
  major?: string | null;
  field?: string | null;
  entryYear?: number | null;
  github?: string | null;
  linkedin?: string | null;
  website?: string | null;
  profileEmail?: string | null;
}
export interface AnalyticsTopPage {
  path: string;
  count: number;
}

export interface AnalyticsDailyView {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsStats {
  totalViews: number;
  todayViews: number;
  monthViews: number;
  uniqueTodayVisitors: number;
  topPages: AnalyticsTopPage[];
  dailyViews: AnalyticsDailyView[];
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  published: boolean;
  slug?: string;
}

export interface AdminArticle {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  category: string;
  year: number;
  content: string;
  published: boolean;
  status?: ContentStatus;
  publishedAt?: string;
}

export interface AdminFacultyMember {
  id: string;
  name: string;
  role: string;
  field: string;
  monogram: string;
  color: string;
  title?: string;
  specialties?: string[];
  isActive?: boolean;
}

export interface AdminFeedback {
  id: string;
  name: string;
  message: string;
  rating: number;
  date: string;
  approved: boolean;
}

export interface AdminContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}


export interface RoleStat {
  role: Role;
  count: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string | null;
  isActive: boolean;
  token: string;
  createdAt: string;
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  body: string;
  sentAt?: string | null;
  recipientCount: number;
  createdAt: string;
}
