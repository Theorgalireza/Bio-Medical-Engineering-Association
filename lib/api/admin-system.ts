import type { AnalyticsStats } from "@/types";
import { apiFetch } from "./client";

export interface SiteSetting {
  key: string;
  value: string;
  updatedAt: string;
}

export async function adminGetAnalyticsStats(): Promise<AnalyticsStats> {
  return apiFetch<AnalyticsStats>("/analytics/stats", { auth: true });
}

export const adminGetAnalytics = adminGetAnalyticsStats;

export async function getSiteSettings(): Promise<SiteSetting[]> {
  return apiFetch<SiteSetting[]>("/site-settings");
}

export async function updateSiteSetting(
  key: string,
  value: string,
): Promise<SiteSetting> {
  return apiFetch<SiteSetting>(`/site-settings/${key}`, {
    method: "PUT",
    body: JSON.stringify({ value }),
    auth: true,
  });
}

export async function bulkUpdateSiteSettings(
  settings: Record<string, string>,
) {
  return apiFetch<SiteSetting[]>("/site-settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
    auth: true,
  });
}
