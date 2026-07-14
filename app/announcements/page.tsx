import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import NeonButton from "@/components/ui/NeonButton";
import { getAnnouncements } from "@/lib/api";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="min-h-screen bg-primary pt-20 pb-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-8">
        <NeonButton href="/" variant="outline">بازگشت به صفحه اصلی</NeonButton>
      </div>
      <AnnouncementsSection items={announcements} />
    </main>
  );
}
