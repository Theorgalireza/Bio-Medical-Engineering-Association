import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "انجمن علمی مهندسی پزشکی | دانشگاه شهید بهشتی",
    template: "%s | انجمن علمی مهندسی پزشکی",
  },
  description:
    "سایت رسمی انجمن علمی مهندسی پزشکی دانشگاه شهید بهشتی؛ اخبار، مقالات، هیئت علمی، گالری و ارتباط با انجمن.",
  keywords: [
    "مهندسی پزشکی",
    "انجمن علمی",
    "دانشگاه شهید بهشتی",
    "بیوالکتریک",
    "BCI",
  ],
  authors: [{ name: "انجمن علمی مهندسی پزشکی" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "انجمن علمی مهندسی پزشکی | دانشگاه شهید بهشتی",
    description:
      "اخبار، مقالات، رویدادها و مسیرهای ارتباطی انجمن علمی مهندسی پزشکی دانشگاه شهید بهشتی.",
    url: siteUrl,
    siteName: "انجمن علمی مهندسی پزشکی",
    locale: "fa_IR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} min-h-screen font-vazir bg-surface text-white antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
