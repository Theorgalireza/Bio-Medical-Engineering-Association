import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { getCachedSiteSettings } from "@/lib/site-settings";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazir",
});

function getSiteUrl() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000";
  return base.startsWith("http") ? base : `https://${base}`;
}

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
const s = await getCachedSiteSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${s.site_name} | دانشگاه شهید بهشتی`,
      template: `%s | ${s.site_name}`,
    },
    description: s.site_description,
    keywords: ["مهندسی پزشکی", "انجمن علمی", "دانشگاه شهید بهشتی", "بیوالکتریک", "BCI"],
    authors: [{ name: s.site_name }],
    alternates: { canonical: "/" },
    openGraph: {
      title: `${s.site_name} | دانشگاه شهید بهشتی`,
      description: s.site_description,
      url: siteUrl,
      siteName: s.site_name,
      locale: "fa_IR",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} min-h-screen font-vazir bg-surface text-white antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
