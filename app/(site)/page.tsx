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

export default async function Home() {
  const [announcements, articles, faculty, gallery] = await Promise.all([
    getAnnouncements(),
    getArticles(),
    getFacultyMembers(),
    getGalleryItems(),
  ]);

  return (
    <main>
      <Hero />
      <CTASection />
      <StatsSection />

      <section id="announcements" className="py-4">
        <AnnouncementsSection items={announcements} />

        <div className="flex justify-center mt-10 pb-8">
          <NeonButton href="/announcements" variant="outline">مشاهده تمام اخبار ↶</NeonButton>
        </div>
      </section>

      <PublicationsSection items={articles} />

      <div className="flex justify-center mt-10 pb-12">
        <NeonButton href="/articles" variant="outline">مشاهده تمام مقالات ↶</NeonButton>
      </div>

      {/* Gallery بین Publications و Faculty */}
      <GallerySection items={gallery} />

      {/* این‌ها خودشون سکشن دارند، نیازی به پیچیدن داخل <section> جدید نیست */}
      <FacultySection items={faculty} />
      <Feedback />
      <Contact />
    </main>
  );
}
