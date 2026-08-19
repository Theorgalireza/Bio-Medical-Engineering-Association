import type { AdminContact, AdminFeedback } from "@/types";
import { apiFetch } from "./client";
import { getPublishedDate } from "./mappers";

export async function adminGetFeedback(): Promise<AdminFeedback[]> {
  const items = await apiFetch<any[]>("/feedback", { auth: true });
  return items.map((item) => ({
    id: String(item.id),
    referenceCode: item.referenceCode ? String(item.referenceCode) : undefined,
    name: String(item.name ?? ""),
    message: String(item.message ?? ""),
    rating: Number(item.rating ?? 0),
    date: getPublishedDate(item),
    approved: Boolean(item.approved),
  }));
}

export async function adminUpdateFeedback(id: string, body: object) {
  return apiFetch(`/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export async function adminDeleteFeedback(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/feedback/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function adminRestoreFeedback(token: string) {
  return apiFetch(`/feedback/restore/${token}`, { method: "POST", auth: true });
}

export async function adminGetContact(): Promise<AdminContact[]> {
  const items = await apiFetch<any[]>("/contact", { auth: true });
  return items.map((item) => ({
    id: String(item.id),
    referenceCode: item.referenceCode ? String(item.referenceCode) : undefined,
    name: String(item.name ?? ""),
    email: String(item.email ?? ""),
    subject: String(item.subject ?? ""),
    message: String(item.message ?? ""),
    date: getPublishedDate(item),
    read: Boolean(item.read),
  }));
}

export const adminGetContacts = adminGetContact;

export async function adminUpdateContact(id: string, body: object) {
  return apiFetch(`/contact/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    auth: true,
  });
}

export const adminMarkContactRead = (id: string) =>
  adminUpdateContact(id, { read: true });

export async function adminDeleteContact(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/contact/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function adminRestoreContact(token: string) {
  return apiFetch(`/contact/restore/${token}`, { method: "POST", auth: true });
}
