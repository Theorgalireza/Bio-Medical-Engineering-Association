import Link from "next/link";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import NeonButton from "@/components/ui/NeonButton";
import { getAnnouncements } from "@/lib/api";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="min-h-screen bg-primary pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-start pb-8">
          <Link href="/" className="inline-block">
            <NeonButton variant="outline">بازگشت به صفحه اصلی</NeonButton>
          </Link>
        </div>
      </div>
      <AnnouncementsSection items={announcements} />
    </main>
  );
}
