import type { NewsletterCampaign, NewsletterSubscriber } from "@/types";
import { apiFetch } from "./client";

export async function adminGetSubscribers(
  all = false,
): Promise<NewsletterSubscriber[]> {
  return apiFetch<NewsletterSubscriber[]>(
    `/newsletter/subscribers${all ? "?all=true" : ""}`,
    { auth: true },
  );
}

export async function adminDeleteSubscriber(id: string) {
  return apiFetch<{ undoToken: string; undoExpiresAt: string }>(`/newsletter/subscribers/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
export const adminRestoreSubscriber = (token: string) => apiFetch(`/newsletter/subscribers/restore/${token}`, { method: "POST", auth: true });

export async function adminGetCampaigns(): Promise<NewsletterCampaign[]> {
  return apiFetch<NewsletterCampaign[]>("/newsletter/campaigns", {
    auth: true,
  });
}

export async function adminSendCampaign(data: {
  subject: string;
  body: string;
}) {
  return apiFetch<NewsletterCampaign>("/newsletter/campaigns/send", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

export async function publicSubscribe(data: {
  email: string;
  name?: string;
}) {
  return apiFetch("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function publicUnsubscribe(token: string) {
  return apiFetch("/newsletter/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function getMyNewsletterSubscription(): Promise<{
  subscribed: boolean;
}> {
  return apiFetch("/newsletter/my-subscription", { auth: true });
}

export async function unsubscribeFromNewsletter(): Promise<void> {
  return apiFetch("/newsletter/unsubscribe-me", {
    method: "POST",
    auth: true,
  });
}

export async function resubscribeToNewsletter(): Promise<void> {
  return apiFetch("/newsletter/resubscribe-me", {
    method: "POST",
    auth: true,
  });
}
