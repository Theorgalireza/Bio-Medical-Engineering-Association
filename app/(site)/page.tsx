// app/(site)/page.tsx
import Hero from "@/components/sections/Hero";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import PublicationsSection from "@/components/sections/PublicationsSection";
import FacultySection from "@/components/sections/FacultySection";
import Feedback from "@/components/sections/FeedbackSection";
import Contact from "@/components/sections/ContactSection";
import NeonButton from "@/components/ui/NeonButton";
import GallerySection from "@/components/sections/GallerySection";
import { getAnnouncements, getFacultyMembers, getGalleryItems, getArticles } from "@/lib/api";
import { getCachedSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const [announcements, articles, faculty, gallery, settings] = await Promise.all([
    getAnnouncements(),
    getArticles(),
    getFacultyMembers(),
    getGalleryItems(),
    getCachedSiteSettings(),
  ]);


  return (
    <main>
      <Hero />
      <CTASection />
      <StatsSection />

      <section id="announcements" className="py-4">
        <AnnouncementsSection items={announcements} />
        <div className="flex justify-center mt-10 pb-8">
          <NeonButton href="/announcements" variant="outline">
            مشاهده تمام اخبار ↶
          </NeonButton>
        </div>
      </section>

      <PublicationsSection items={articles} />

      <div className="flex justify-center mt-10 pb-12">
        <NeonButton href="/articles" variant="outline">
          مشاهده تمام مقالات ↶
        </NeonButton>
      </div>

      <GallerySection items={gallery} />
      <FacultySection items={faculty} />
      <Feedback />
      <Contact settings={settings} />
    </main>
  );
}
