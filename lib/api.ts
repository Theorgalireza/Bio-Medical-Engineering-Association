import type {
  Announcement,
  Article,
  FacultyMember,
  GalleryItem,
  Feedback,
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
  Profile,
  ActivityLog,
  ActivityLogsResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type ApiEnvelope<T> = { success?: boolean; data?: T };

function extractErrorMessage(errorBody: unknown, fallback: string): string {
  if (!errorBody || typeof errorBody !== 'object') {
    return fallback;
  }

  const message = (errorBody as { message?: unknown }).message;

  if (Array.isArray(message)) {
    const joined = message.map((item) => String(item)).filter(Boolean).join('، ');
    return joined || fallback;
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}

let cachedCsrfToken: string | null = null;
let csrfTokenPromise: Promise<string | null> | null = null;

async function fetchCsrfToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (cachedCsrfToken) {
    return cachedCsrfToken;
  }

  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch(`${API_BASE_URL}/csrf-token`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) {
          return null;
        }

        const json = await res.json().catch(() => null);
        const token = json?.csrfToken;
        if (typeof token === "string" && token.length > 0) {
          cachedCsrfToken = token;
          return token;
        }

        return null;
      })
      .catch(() => null)
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
  auth = false,
): Promise<T> {
  const { auth: authFromOptions, ...rest } = options;
  const needsAuth = auth || Boolean(authFromOptions);
  const headers = new Headers(rest.headers);
  const method = String(rest.method ?? "GET").toUpperCase();

  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && rest.body instanceof Blob;
  const isArrayBuffer = typeof ArrayBuffer !== "undefined" && (rest.body instanceof ArrayBuffer || ArrayBuffer.isView(rest.body as ArrayBufferView));

  if (rest.body && !isFormData && !isBlob && !isArrayBuffer) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = await fetchCsrfToken();
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }
  // هدر Authorization حذف شد؛ کوکی httpOnly به‌طور خودکار ارسال می‌شود
  void needsAuth;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    credentials: "include", // ارسال خودکار کوکی access_token
    cache: "no-store",
  });

if (!res.ok) {
  let errorBody: unknown = null;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    errorBody = await res.json().catch(() => null);
  }
  throw new Error(extractErrorMessage(errorBody, `درخواست ناموفق: ${res.status}`));
}

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return (await res.text()) as unknown as T;
  }

  const json = await res.json();
  return (json?.data !== undefined && json?.meta === undefined ? json.data : json) as T;
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
    date: item.date ? String(item.date) : getPublishedDate(item),
    authors: asStringArray(item.authors),
    year: Number(item.year ?? new Date(item.createdAt ?? Date.now()).getFullYear()),
    readingTime: Number(item.readingTime ?? 8),
    featured: Boolean(item.featured),
    status: item.status,
    publishedAt: item.publishedAt ?? undefined,
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

function mapBackendRole(role: unknown): Role {
  const value = String(role ?? "").toUpperCase() as Role;
  return VALID_ROLES.has(value) ? value : "GUEST";
}

function toProfile(profile: any, fallbackUserId?: string): Profile {
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
    avatarUrl: item.avatarUrl ?? null,
    profile: profile ? toProfile(profile, item.id) : null,
  };
}
function normalizeRole(role: Role | string): Role {
  const upper = String(role).toUpperCase();

  if (upper === "MEMBER") {
    return "STUDENT_MEMBER";
  }

  if (VALID_ROLES.has(upper as Role)) {
    return upper as Role;
  }

  return "STUDENT_MEMBER";
}

// ─── Public ───────────────────────────────────────────────

export async function trackPageView(path: string) {
  return apiFetch<void>("/analytics/track", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function adminGetAnalyticsStats() {
  return apiFetch<AnalyticsStats>("/analytics/stats", { auth: true });
}

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



export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const item = await apiFetch<any>(`/articles/${slug}`);
    return item ? toArticle(item) : null;
  } catch {
    return null;
  }
}


export async function getArticles(): Promise<Article[]> {
  return (
    await apiFetch<any[]>("/articles?status=PUBLISHED")
  ).map(toArticle);
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
export async function loginWithPassword(payload: {
  email?: string;
  phone?: string;
  password: string;
}) {
  return apiFetch<{ user: { id: string; email: string; role: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}


export async function getActivityLogs(params: {
  page?: number;
  limit?: number;
  action?: string;
  targetType?: string;
} = {}): Promise<ActivityLogsResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 20));

  if (params.action) {
    searchParams.set("action", String(params.action));
  }

  if (params.targetType) {
    searchParams.set("targetType", String(params.targetType));
  }

  const response = await apiFetch<ActivityLogsResponse>(`/activity-logs?${searchParams.toString()}`, {
    auth: true,
  });

  const data: ActivityLog[] = response.data;
  return {
    ...response,
    data,
  };
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
    summary: String(item.summary ?? ""),
    authors: asStringArray(item.authors),
    category: String(item.category ?? ""),
    year: Number(item.year ?? new Date(item.createdAt ?? Date.now()).getFullYear()),
    content: String(item.content ?? ""),
    published: String(item.status ?? "").toUpperCase() === "PUBLISHED",
    status: item.status,
    slug: item.slug ?? undefined,
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
  return apiFetch<any[]>("/faculty", {}, true).then((items) =>
    items.map((item) => ({
      id: String(item.id),
      name: String(item.name ?? ""),
      title: String(item.title ?? ""),
      specialties: asStringArray(item.specialties),
      role: item.title ?? "",
      field: asStringArray(item.specialties).join("، "),
      monogram: item.monogram ?? String(item.name ?? "").charAt(0),
      color: item.color ?? "#00d4ff",
      isActive: Boolean(item.isActive),
    })),
  );
}

export async function adminCreateFaculty(body: object) {
  return apiFetch<any>("/faculty", {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
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

// ─── Admin: Gallery ────────────────────────────────────────
export async function adminGetGallery(): Promise<GalleryItem[]> {
  return apiFetch<any[]>("/gallery", {}, true).then((items) => items.map(toGalleryItem));
}
export async function adminUpdateGallery(id: string, body: object) {
  return apiFetch<any>(
    `/gallery/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    true,
  );
}

export async function adminCreateGallery(body: object) {
  return apiFetch<any>("/gallery", {
    method: "POST",
    body: JSON.stringify(body),
  }, true);
}

export async function adminDeleteGallery(id: string) {
  return apiFetch<void>(`/gallery/${id}`, { method: "DELETE" }, true);
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

export async function adminUpdateFeedback(id: string, body: object) {
  return apiFetch<any>(`/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }, true);
}

export async function adminDeleteFeedback(id: string) {
  return apiFetch<void>(`/feedback/${id}`, { method: "DELETE" }, true);
}

// ─── Admin: Contact ────────────────────────────────────────
export async function adminGetContact(): Promise<AdminContact[]> {
  return apiFetch<any[]>("/contact", {}, true).then((items) => items.map(toContact));
}

export async function adminUpdateContact(id: string, body: object) {
  return apiFetch<any>(`/contact/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  }, true);
}

export async function adminDeleteContact(id: string) {
  return apiFetch<void>(`/contact/${id}`, { method: "DELETE" }, true);
}

// ─── Auth / Profile ───────────────────────────────────────
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await apiFetch<ApiEnvelope<ApiUser>>("/users/me", { auth: true }, true);
    const payload = (response as any)?.data ?? response;
    return toUser(payload);
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const response = await apiFetch<any>("/users/me", { auth: true }, true);
    return response?.profile ? toProfile(response.profile, response.id) : null;
  } catch {
    return null;
  }
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<Profile> {
  const response = await apiFetch<any>("/users/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
  return response?.profile ? toProfile(response.profile, response.id) : toProfile(response, response?.id);
}

export async function updateUserRole(userId: string, role: Role) {
  return apiFetch(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: normalizeRole(role) }),
  }, true);
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  return apiFetch(`/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  }, true);
}

export async function adminGetUsers(): Promise<ApiUser[]> {
  return apiFetch<any[]>("/users", {}, true).then((items) => items.map(toUser));
}

export async function adminDeleteUser(userId: string) {
  return apiFetch<void>(`/users/${userId}`, { method: "DELETE" }, true);
}

export async function adminCreateUser(payload: CreateUserPayload) {
  return apiFetch<{ user: ApiUser }>("/users", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      role: normalizeRole(payload.role),
    }),
  }, true);
}

export async function getAuthStatus(): Promise<{ authenticated: boolean; role: string | null }> {
  try {
    const me = await getCurrentUser();
    return { authenticated: Boolean(me), role: me?.role ?? null };
  } catch {
    return { authenticated: false, role: null };
  }
}

export async function getActivityLogsCount(): Promise<number> {
  const response = await getActivityLogs({ page: 1, limit: 1 });
  return response.meta?.total ?? response.data.length;
}

export async function getPublications() {
  return apiFetch("/publications");
}

export interface SiteSetting { key: string; value: string; updatedAt: string; }

export async function getSiteSettings(): Promise<SiteSetting[]> {
  return apiFetch<SiteSetting[]>('/site-settings');
}

export async function updateSiteSetting(key: string, value: string): Promise<SiteSetting> {
  return apiFetch<SiteSetting>(`/site-settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }, true);
}

export async function bulkUpdateSiteSettings(settings: Record<string, string>) {
  return apiFetch<SiteSetting[]>('/site-settings', { method: 'PUT', body: JSON.stringify({ settings }) }, true);
}

// اضافه کردن به انتهای lib/api.ts

// --- Newsletter ---
export async function adminGetSubscribers(all = false) {
  return apiFetch(`/newsletter/subscribers${all ? '?all=true' : ''}`);
}

export async function adminDeleteSubscriber(id: string) {
  return apiFetch(`/newsletter/subscribers/${id}`, { method: 'DELETE' });
}

export async function adminGetCampaigns() {
  return apiFetch('/newsletter/campaigns');
}

export async function adminSendCampaign(data: { subject: string; body: string }) {
  return apiFetch('/newsletter/campaigns/send', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function publicSubscribe(data: { email: string; name?: string }) {
  return apiFetch('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


import type { AnalyticsStats } from "@/types";

export async function adminGetAnalytics() {
  return apiFetch<AnalyticsStats>("/analytics/stats", {}, true);
}

export async function trackVisit(path: string) {
  return apiFetch("/analytics/track", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export const adminGetContacts = adminGetContact;
export const adminMarkContactRead = (id: string) => adminUpdateContact(id, { read: true });
export const getUsers = adminGetUsers;
export const updateUserProfile = (userId: string, payload: UpdateProfilePayload) =>
  apiFetch(`/users/${userId}/profile`, { method: "PATCH", body: JSON.stringify(payload) }, true);
export const createUser = adminCreateUser;
export const deleteUser = adminDeleteUser;
export const updateMyProfile = updateProfile;
// re-export type چون فقط import شده بود، نه export
export type { Profile };
