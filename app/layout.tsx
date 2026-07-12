import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import ClientLayout from "./ClientLayout";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "انجمن علمی مهندسی پزشکی - شاخه بیوالکتریک | دانشگاه شهید بهشتی",
  description:
    "انجمن علمی مهندسی پزشکی، شاخه بیوالکتریک (نورو/بیوالکتریک) دانشگاه شهید بهشتی. فعالیت‌های علمی، پژوهشی و آموزشی در حوزه سیگنال‌های زیستی، الکترونیک پزشکی و علوم اعصاب محاسباتی.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} font-vazir bg-surface text-white antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
