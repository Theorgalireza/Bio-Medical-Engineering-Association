import type {
  Announcement,
  Article,
  ContactSubmissionResult,
  FacultyMember,
  Feedback,
  FeedbackSubmissionResult,
  GalleryItem,
} from "@/types";
import { apiFetch } from "./client";
import {
  toAnnouncement,
  toArticle,
  toFacultyMember,
  toFeedback,
  toGalleryItem,
} from "./mappers";

export async function trackPageView(path: string) {
  return apiFetch<void>("/analytics/track", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function trackVisit(path: string) {
  return trackPageView(path);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const items = await apiFetch<any[]>("/announcements");
  return items.map(toAnnouncement);
}

export async function getAnnouncementBySlug(
  slug: string,
): Promise<Announcement | null> {
  try {
    const item = await apiFetch<any>(`/announcements/${slug}`);
    return item ? toAnnouncement(item) : null;
  } catch {
    return null;
  }
}

export async function getArticles(): Promise<Article[]> {
  const items = await apiFetch<any[]>("/articles?status=PUBLISHED");
  return items.map(toArticle);
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  try {
    const item = await apiFetch<any>(`/articles/${slug}`);
    return item ? toArticle(item) : null;
  } catch {
    return null;
  }
}

export async function getPublications(): Promise<Article[]> {
  return getArticles();
}

export async function getFacultyMembers(): Promise<FacultyMember[]> {
  const items = await apiFetch<any[]>("/faculty");
  return items.map(toFacultyMember);
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const items = await apiFetch<any[]>("/gallery");
  return items.map(toGalleryItem);
}

export async function getFeedbacks(): Promise<Feedback[]> {
  const items = await apiFetch<any[]>("/feedback/approved");
  return items.map(toFeedback);
}

export async function submitContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactSubmissionResult> {
  return apiFetch<ContactSubmissionResult>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitFeedback(payload: {
  name: string;
  message: string;
  rating: number;
}): Promise<FeedbackSubmissionResult> {
  return apiFetch<FeedbackSubmissionResult>("/feedback", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
