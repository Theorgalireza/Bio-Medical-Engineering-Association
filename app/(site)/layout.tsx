import type { ReactNode } from "react";
import ClientLayout from "../ClientLayout";
import { getCachedSiteSettings } from "@/lib/site-settings";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getCachedSiteSettings();

  return <ClientLayout settings={settings}>{children}</ClientLayout>;
}
