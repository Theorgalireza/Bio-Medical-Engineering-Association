import type {
  AdminContact,
  AdminFacultyMember,
  AdminFeedback,
  ApiUser,
  Announcement,
  Article,
  FacultyMember,
  Feedback,
  GalleryItem,
  Profile,
  Role,
} from "@/types";

export function formatDate(value?: string | Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export function getPublishedDate(item: {
  publishedAt?: string | null;
  createdAt?: string | null;
  date?: string | null;
}): string {
  return formatDate(item.publishedAt || item.createdAt || item.date);
}

export function mapAnnouncementType(type: unknown): Announcement["type"] {
  const value = String(type ?? "NEWS").toUpperCase();
  return ["WORKSHOP", "WEBINAR", "EVENT", "NEWS"].includes(value)
    ? (value as Announcement["type"])
    : "NEWS";
}

export function toAnnouncement(item: any): Announcement {
  return {
    id: String(item.id),
    slug: String(item.slug ?? ""),
    title: String(item.title ?? ""),
    date: item.date ? String(item.date) : getPublishedDate(item),
    type: mapAnnouncementType(item.type),
    description: String(item.description ?? ""),
    imageUrl: item.imageUrl ?? undefined,
    isNew: Boolean(item.isNew),
  };
}

export function toArticle(item: any): Article {
  return {
    id: String(item.id),
    slug: String(item.slug ?? ""),
    title: String(item.title ?? ""),
    summary: String(item.summary ?? ""),
    content: item.content ?? item.summary ?? "",
    category: String(item.category ?? ""),
    date: item.date ? String(item.date) : getPublishedDate(item),
    authors: asStringArray(item.authors),
    year: Number(
      item.year ?? new Date(item.createdAt ?? Date.now()).getFullYear(),
    ),
    readingTime: Number(item.readingTime ?? 8),
    featured: Boolean(item.featured),
    status: item.status,
    publishedAt: item.publishedAt ?? undefined,
  };
}

export function toFacultyMember(item: any): FacultyMember {
  const specialties = asStringArray(item.specialties);
  return {
    id: String(item.id),
    name: String(item.name ?? ""),
    title: String(item.title ?? ""),
    specialties,
    role: item.role ?? item.title ?? "",
    field: item.field ?? specialties.join("، "),
    monogram: item.monogram ?? String(item.name ?? "").charAt(0),
    color: item.color ?? "#00d4ff",
  };
}

export function toGalleryItem(item: any): GalleryItem {
  return {
    id: String(item.id),
    title: String(item.title ?? ""),
    description: String(item.description ?? ""),
    imageUrl: String(item.imageUrl ?? ""),
    date: getPublishedDate(item),
    category: item.category ?? "",
    uploadedById: item.uploadedById ?? undefined,
  };
}

export function toFeedback(item: any): Feedback {
  return {
    id: String(item.id),
    referenceCode: item.referenceCode ? String(item.referenceCode) : undefined,
    name: item.name ?? undefined,
    message: String(item.message ?? ""),
    rating: Number(item.rating ?? 0),
    date: getPublishedDate(item),
    approved: Boolean(item.approved),
  };
}

export function toContact(item: any): AdminContact {
  return {
    id: String(item.id),
    referenceCode: item.referenceCode ? String(item.referenceCode) : undefined,
    name: String(item.name ?? ""),
    email: String(item.email ?? ""),
    subject: String(item.subject ?? ""),
    message: String(item.message ?? ""),
    date: getPublishedDate(item),
    read: Boolean(item.read),
  };
}

const VALID_ROLES = new Set<Role>([
  "OWNER",
  "ADMIN",
  "CONTENT_EDITOR",
  "STUDENT_MEMBER",
  "STUDENT_ACTIVE_MEMBER",
  "STUDENT_INACTIVE_MEMBER",
  "FACULTY_MEMBER",
  "GUEST",
]);

export function mapBackendRole(role: unknown): Role {
  const value = String(role ?? "").toUpperCase() as Role;
  return VALID_ROLES.has(value) ? value : "GUEST";
}

export function toProfile(profile: any, fallbackUserId?: string): Profile {
  return {
    id: String(profile?.id ?? fallbackUserId ?? ""),
    userId: String(profile?.userId ?? fallbackUserId ?? ""),
    firstName: profile?.firstName ?? null,
    lastName: profile?.lastName ?? null,
    studentId: profile?.studentId ?? null,
    university: profile?.university ?? null,
    major: profile?.major ?? null,
    field: profile?.field ?? null,
    entryYear:
      profile?.entryYear === null || profile?.entryYear === undefined
        ? null
        : Number(profile.entryYear),
    github: profile?.github ?? null,
    linkedin: profile?.linkedin ?? null,
    website: profile?.website ?? null,
    profileEmail: profile?.profileEmail ?? null,
  };
}

export function toUser(item: any): ApiUser {
  return {
    id: String(item.id),
    email: item.email ?? null,
    phone: item.phone ?? null,
    role: mapBackendRole(item.role),
    isActive: Boolean(item.isActive),
    createdAt: item.createdAt
      ? String(item.createdAt)
      : new Date().toISOString(),
    updatedAt: item.updatedAt
      ? String(item.updatedAt)
      : new Date().toISOString(),
    avatarUrl: item.avatarUrl ?? null,
    profile: item.profile ? toProfile(item.profile, item.id) : null,
  };
}

export function normalizeRole(role: Role | string): Role {
  const value = String(role).toUpperCase();
  if (value === "MEMBER") return "STUDENT_MEMBER";
  return VALID_ROLES.has(value as Role) ? (value as Role) : "STUDENT_MEMBER";
}
