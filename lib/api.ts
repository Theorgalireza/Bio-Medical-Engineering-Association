import type {
  Announcement,
  Article,
  Publication,
  FacultyMember,
  GalleryItem,
  Feedback,
  ContactInfoItem,
  Role,
  ApiUser,
  CreateUserPayload,
  UpdateProfilePayload,
  AdminAnnouncement,
  AdminArticle,
  AdminFacultyMember,
  AdminFeedback,
  AdminContact,
  CurrentUser,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type ApiEnvelope<T> = { success?: boolean; data?: T };

async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth, ...rest } = options;
  const headers = new Headers(rest.headers);

  if (rest.body) {
    headers.set("Content-Type", "application/json");
  }
  // هدر Authorization حذف شد؛ کوکی httpOnly به‌طور خودکار ارسال می‌شود

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: "include", // ارسال خودکار کوکی access_token
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || `درخواست ناموفق: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return (await res.text()) as unknown as T;
  }

  const json = await res.json();
  return (json?.data !== undefined ? json.data : json) as T;
}

function formatDate(value?: string | Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  return [];
}

function getPublishedDate(item: { publishedAt?: string | null; createdAt?: string | null; date?: string | null }): string {
  return formatDate(item.publishedAt || item.createdAt || item.date || null);
}

function mapAnnouncementType(type: unknown): Announcement["type"] {
  const upper = String(type ?? "NEWS").toUpperCase();
  if (upper === "WORKSHOP" || upper === "WEBINAR" || upper === "EVENT" || upper === "NEWS") {
    return upper;
  }
  return "NEWS";
}

function toAnnouncement(item: any): Announcement {
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

function toArticle(item: any): Article {
  return {
    id: String(item.id),
    slug: String(item.slug ?? ""),
    title: String(item.title ?? ""),
    summary: String(item.summary ?? ""),
    content: item.content ?? item.summary ?? "",
    category: String(item.category ?? ""),
    authors: asStringArray(item.authors),
    year: Number(item.year ?? new Date(item.createdAt ?? Date.now()).getFullYear()),
    readingTime: Number(item.readingTime ?? 8),
    featured: Boolean(item.featured),
    status: item.status,
    publishedAt: item.publishedAt ?? undefined,
  };
}

function toPublication(item: any): Publication {
  return {
    id: String(item.id),
    slug: String(item.slug ?? ""),
    title: String(item.title ?? ""),
    issue: String(item.issue ?? ""),
    date: item.date ? String(item.date) : getPublishedDate(item),
    category: String(item.category ?? ""),
    summary: String(item.summary ?? item.description ?? ""),
    authors: asStringArray(item.authors),
    year: Number(item.year ?? new Date(item.createdAt ?? Date.now()).getFullYear()),
    description: String(item.description ?? item.summary ?? ""),
    downloadUrl: String(item.downloadUrl ?? "#"),
  };
}

function toFacultyMember(item: any): FacultyMember {
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

function toGalleryItem(item: any): GalleryItem {
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

function toFeedback(item: any): Feedback {
  return {
    id: String(item.id),
    name: item.name ?? undefined,
    message: String(item.message ?? ""),
    rating: Number(item.rating ?? 0),
    date: getPublishedDate(item),
    approved: Boolean(item.approved),
  };
}

function toContact(item: any): AdminContact {
  return {
    id: String(item.id),
    name: String(item.name ?? ""),
    email: String(item.email ?? ""),
    subject: String(item.subject ?? ""),
    message: String(item.message ?? ""),
    date: getPublishedDate(item),
    read: Boolean(item.read),
  };
}

function mapBackendRole(role: unknown): Role {
  const value = String(role ?? "").toUpperCase();
  if (value === "OWNER" || value === "ADMIN") return value;
  return "MEMBER";
}

function toUser(item: any): ApiUser {
  const profile = item.profile ?? null;
  return {
    id: String(item.id),
    email: item.email ?? null,
    phone: item.phone ?? null,
    role: mapBackendRole(item.role),
    isActive: Boolean(item.isActive),
    createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
    updatedAt: item.updatedAt ? String(item.updatedAt) : new Date().toISOString(),
    profile: profile
      ? {
          id: String(profile.id ?? item.id),
          firstName: profile.firstName ?? null,
          lastName: profile.lastName ?? null,
          studentId: profile.studentId ?? null,
          major: profile.major ?? null,
          entryYear:
            profile.entryYear === null || profile.entryYear === undefined
              ? null
              : String(profile.entryYear),
          university: profile.university ?? null,
          field: profile.field ?? null,
          github: profile.github ?? null,
          linkedin: profile.linkedin ?? null,
          website: profile.website ?? null,
          profileEmail: profile.profileEmail ?? null,
        }
      : null,
  };
}

function normalizeRole(role: Role | string): string {
  const upper = String(role).toUpperCase();
  if (upper === "OWNER" || upper === "ADMIN") return upper;
  return "STUDENT_MEMBER";
}

// ─── Public ───────────────────────────────────────────────
export async function getAnnouncements(): Promise<Announcement[]> {
  return (await apiFetch<any[]>("/announcements")).map(toAnnouncement);
}

export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  try {
    const item = await apiFetch<any>(`/announcements/${slug}`);
    return item ? toAnnouncement(item) : null;
  } catch {
    return null;
  }
}

export async function getArticles(): Promise<Article[]> {
  return (await apiFetch<any[]>("/articles")).map(toArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const item = await apiFetch<any>(`/articles/${slug}`);
    return item ? toArticle(item) : null;
  } catch {
    return null;
  }
}

export async function getPublications(): Promise<Publication[]> {
  return (await apiFetch<any[]>("/publications?status=PUBLISHED")).map(toPublication);
}

export async function getFacultyMembers(): Promise<FacultyMember[]> {
  return (await apiFetch<any[]>("/faculty")).map(toFacultyMember);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return (await apiFetch<any[]>("/gallery")).map(toGalleryItem);
}

export async function getFeedbacks(): Promise<Feedback[]> {
  return (await apiFetch<any[]>("/feedback/approved")).map(toFeedback);
}

export async function submitContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return apiFetch("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitFeedback(payload: {
  name: string;
  message: string;
  rating: number;
}) {
  return apiFetch("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function loginWithPassword(payload: { email: string; password: string }) {
  // backend دیگر access_token را در body برنمی‌گرداند؛ آن را در httpOnly cookie ست می‌کند
  return apiFetch<{ user: { id: string; email: string; role: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function register(payload: {
  email?: string;
  phone?: string;
  password?: string;
}) {
  return apiFetch<{ user: { id: string; email: string; role: string } }>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export async function sendOtp(payload: { phone: string }) {
  return apiFetch("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(identifier: string) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function resetPassword(payload: { token: string; newPassword: string }) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export type OAuthProvider = 'google' | 'github' | 'linkedin';

export function getOAuthLoginUrl(provider: OAuthProvider) {
  return `${API_BASE_URL}/auth/${provider}`;
}
// ─── Admin: Announcements ─────────────────────────────────
export async function adminGetAnnouncements(): Promise<AdminAnnouncement[]> {
  const statuses = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;
  const results = await Promise.all(
    statuses.map((status) => apiFetch<any[]>(`/announcements?status=${status}`, {}, true).catch(() => [])),
  );
  return results.reduce<any[]>((acc, cur) => acc.concat(cur), []).map((item) => ({
    id: String(item.id),
    title: String(item.title ?? ""),
    date: item.date ? String(item.date) : getPublishedDate(item),
    category: mapAnnouncementType(item.type),
    content: String(item.description ?? ""),
    published: String(item.status ?? "").toUpperCase() === "PUBLISHED",
    slug: item.slug ?? undefined,
  }));
}

export async function adminCreateAnnouncement(body: object) {
  return apiFetch<any>("/announcements", {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

export async function adminUpdateAnnouncement(id: string, body: object) {
  return apiFetch<any>(`/announcements/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }, true);
}

export async function adminDeleteAnnouncement(id: string) {
  return apiFetch<void>(`/announcements/${id}`, { method: "DELETE" }, true);
}

// ─── Admin: Articles ───────────────────────────────────────
export async function adminGetArticles(): Promise<AdminArticle[]> {
  const statuses = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;
  const results = await Promise.all(
    statuses.map((status) => apiFetch<any[]>(`/articles?status=${status}`, {}, true).catch(() => [])),
  );
  return results.reduce<any[]>((acc, cur) => acc.concat(cur), []).map((item) => ({
    id: String(item.id),
    title: String(item.title ?? ""),
    authors: asStringArray(item.authors),
    issue: String(item.category ?? ""),
    date: item.date ? String(item.date) : getPublishedDate(item),
    content: String(item.content ?? item.summary ?? ""),
    published: String(item.status ?? "").toUpperCase() === "PUBLISHED",
    category: String(item.category ?? ""),
    status: item.status,
    publishedAt: item.publishedAt ?? undefined,
  }));
}

export async function adminCreateArticle(body: object) {
  return apiFetch<any>("/articles", {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

export async function adminUpdateArticle(id: string, body: object) {
  return apiFetch<any>(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }, true);
}

export async function adminDeleteArticle(id: string) {
  return apiFetch<void>(`/articles/${id}`, { method: "DELETE" }, true);
}

// ─── Admin: Faculty ────────────────────────────────────────
export async function adminGetFaculty(): Promise<AdminFacultyMember[]> {
  return (await apiFetch<any[]>("/faculty", {}, true)).map((item) => {
    const specialties = asStringArray(item.specialties);
    return {
      id: String(item.id),
      name: String(item.name ?? ""),
      role: String(item.title ?? ""),
      field: item.field ?? specialties.join("، "),
      monogram: String(item.monogram ?? String(item.name ?? "").charAt(0)),
      color: String(item.color ?? "#00d4ff"),
      title: String(item.title ?? ""),
      specialties,
      isActive: Boolean(item.isActive),
    };
  });
}

export async function adminCreateFaculty(body: object) {
  return apiFetch<any>("/faculty", {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}
export async function getCurrentUser() {
  return apiFetch<CurrentUser>("/users/me", { method: "GET" });
}

export async function adminUpdateFaculty(id: string, body: object) {
  return apiFetch<any>(`/faculty/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }, true);
}

export async function adminDeleteFaculty(id: string) {
  return apiFetch<void>(`/faculty/${id}`, { method: "DELETE" }, true);
}

// ─── Admin: Feedback ───────────────────────────────────────
export async function adminGetFeedback(): Promise<AdminFeedback[]> {
  return (await apiFetch<any[]>("/feedback", {}, true)).map((item) => ({
    id: String(item.id),
    name: String(item.name ?? ""),
    message: String(item.message ?? ""),
    rating: Number(item.rating ?? 0),
    date: getPublishedDate(item),
    approved: Boolean(item.approved),
  }));
}

export async function adminUpdateFeedback(id: string, approved: boolean) {
  return apiFetch<any>(
    `/feedback/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    },
    true,
  );
}

export async function adminDeleteFeedback(id: string) {
  return apiFetch<void>(`/feedback/${id}`, { method: "DELETE" }, true);
}

// ─── Admin: Contact ────────────────────────────────────────
export async function adminGetContacts(): Promise<AdminContact[]> {
  return (await apiFetch<any[]>("/contact", {}, true)).map(toContact);
}

export async function adminMarkContactRead(id: string) {
  return apiFetch<any>(
    `/contact/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
    },
    true,
  );
}

export async function adminDeleteContact(id: string) {
  return apiFetch<void>(`/contact/${id}`, { method: "DELETE" }, true);
}

// ─── Admin: Users ──────────────────────────────────────────
export async function getUsers(): Promise<ApiUser[]> {
  return (await apiFetch<any[]>("/users", {}, true)).map(toUser);
}

export async function createUser(body: CreateUserPayload) {
  return apiFetch<ApiUser>(
    "/users",
    {
      method: "POST",
      body: JSON.stringify({
        email: body.email || undefined,
        phone: body.phone || undefined,
        password: body.password,
        role: normalizeRole(body.role),
        firstName: body.firstName || undefined,
        lastName: body.lastName || undefined,
        studentId: body.studentId || undefined,
        major: body.major || undefined,
        entryYear: body.entryYear ? Number(body.entryYear) : undefined,
      }),
    },
    true,
  ).then(toUser);
}

export async function updateMyProfile(payload: Partial<Profile>) {
  return apiFetch<CurrentUser>("/users/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateUserRole(id: string, role: Role) {
  return apiFetch<ApiUser>(
    `/users/${id}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role: normalizeRole(role) }),
    },
    true,
  ).then(toUser);
}

export async function updateUserStatus(id: string, isActive: boolean) {
  return apiFetch<ApiUser>(
    `/users/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    },
    true,
  ).then(toUser);
}

export async function deleteUser(id: string) {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE" }, true);
}
