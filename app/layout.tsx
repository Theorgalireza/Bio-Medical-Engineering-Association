import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: "انجمن علمی مهندسی پزشکی - شاخه بیوالکتریک",
  description:
    "انجمن علمی مهندسی پزشکی دانشگاه شهید بهشتی",
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
        {children}
      </body>
    </html>
  );
}