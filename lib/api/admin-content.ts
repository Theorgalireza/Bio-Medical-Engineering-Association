import type {
  AdminAnnouncement,
  AdminArticle,
  AdminFacultyMember,
  GalleryItem,
} from "@/types";
import { apiFetch } from "./client";
import {
  asStringArray,
  getPublishedDate,
  mapAnnouncementType,
  toGalleryItem,
} from "./mappers";

const CONTENT_STATUSES = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;

export async function adminGetAnnouncements(): Promise<AdminAnnouncement[]> {
  const results = await Promise.all(
    CONTENT_STATUSES.map((status) =>
      apiFetch<any[]>(`/announcements/admin?status=${status}`, {
        auth: true,
      }).catch(() => []),
    ),
  );

  return results.flat().map((item) => ({
    id: String(item.id),
    title: String(item.title ?? ""),
    date: item.date ? String(item.date) : getPublishedDate(item),
    category: mapAnnouncementType(item.type),
    content: String(item.description ?? ""),
    published: String(item.status).toUpperCase() === "PUBLISHED",
    slug: item.slug ?? undefined,
  }));
}

export async function adminCreateAnnouncement(body: object) {
  return apiFetch("/announcements", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminUpdateAnnouncement(id: string, body: object) {
  return apiFetch(`/announcements/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminDeleteAnnouncement(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/announcements/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
export const adminRestoreAnnouncement = (token: string) => apiFetch(`/announcements/restore/${token}`, { method: "POST", auth: true });

export async function adminGetArticles(): Promise<AdminArticle[]> {
  const results = await Promise.all(
    CONTENT_STATUSES.map((status) =>
      apiFetch<any[]>(`/articles/admin?status=${status}`, {
        auth: true,
      }).catch(() => []),
    ),
  );

  return results.flat().map((item) => ({
    id: String(item.id),
    title: String(item.title ?? ""),
    summary: String(item.summary ?? ""),
    authors: asStringArray(item.authors),
    category: String(item.category ?? ""),
    year: Number(
      item.year ?? new Date(item.createdAt ?? Date.now()).getFullYear(),
    ),
    content: String(item.content ?? ""),
    published: String(item.status).toUpperCase() === "PUBLISHED",
    status: item.status,
    slug: item.slug ?? undefined,
  }));
}

export async function adminCreateArticle(body: object) {
  return apiFetch("/articles", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminUpdateArticle(id: string, body: object) {
  return apiFetch(`/articles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminDeleteArticle(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/articles/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
export const adminRestoreArticle = (token: string) => apiFetch(`/articles/restore/${token}`, { method: "POST", auth: true });

export async function adminGetFaculty(): Promise<AdminFacultyMember[]> {
  const items = await apiFetch<any[]>("/faculty", { auth: true });
  return items.map((item) => ({
    id: String(item.id),
    name: String(item.name ?? ""),
    title: String(item.title ?? ""),
    specialties: asStringArray(item.specialties),
    role: item.title ?? "",
    field: asStringArray(item.specialties).join("، "),
    monogram: item.monogram ?? String(item.name ?? "").charAt(0),
    color: item.color ?? "#00d4ff",
    isActive: Boolean(item.isActive),
  }));
}

export async function adminCreateFaculty(body: object) {
  return apiFetch("/faculty", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminUpdateFaculty(id: string, body: object) {
  return apiFetch(`/faculty/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminDeleteFaculty(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/faculty/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
export const adminRestoreFaculty = (token: string) => apiFetch(`/faculty/restore/${token}`, { method: "POST", auth: true });

export async function adminGetGallery(): Promise<GalleryItem[]> {
  const items = await apiFetch<any[]>("/gallery", { auth: true });
  return items.map(toGalleryItem);
}

export async function adminCreateGallery(body: object) {
  return apiFetch("/gallery", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminUpdateGallery(id: string, body: object) {
  return apiFetch(`/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminDeleteGallery(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/gallery/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
export const adminRestoreGallery = (token: string) => apiFetch(`/gallery/restore/${token}`, { method: "POST", auth: true });
