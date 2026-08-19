// app/(site)/page.tsx
import { Suspense } from "react";
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
import { getCachedSiteSettings } from "@/lib/site/settings";
import HomeSkeleton from "@/components/site/HomeSkeleton";
import HomeLoadingGate from "@/components/site/HomeLoadingGate";

async function HomeContent() {
  const [announcementsResult, articlesResult, facultyResult, galleryResult, settings] =
    await Promise.all([
      getAnnouncements().then((data) => ({ data, error: false })).catch(() => ({ data: [], error: true })),
      getArticles().then((data) => ({ data, error: false })).catch(() => ({ data: [], error: true })),
      getFacultyMembers().then((data) => ({ data, error: false })).catch(() => ({ data: [], error: true })),
      getGalleryItems().then((data) => ({ data, error: false })).catch(() => ({ data: [], error: true })),
      getCachedSiteSettings(),
    ]);

  return (
    <main>
      <Hero />
      <CTASection />
      <StatsSection />

      <section id="announcements" className="py-4">
        <AnnouncementsSection items={announcementsResult.data} initialError={announcementsResult.error} />
        <div className="mt-10 flex justify-center pb-8">
          <NeonButton href="/announcements" variant="outline">
            مشاهده تمام اخبار ←
          </NeonButton>
        </div>
      </section>

      <PublicationsSection items={articlesResult.data} initialError={articlesResult.error} />

      <div className="mt-10 flex justify-center pb-12">
        <NeonButton href="/articles" variant="outline">
          مشاهده تمام مقالات ←
        </NeonButton>
      </div>

      <GallerySection items={galleryResult.data} initialError={galleryResult.error} />
      <FacultySection items={facultyResult.data} initialError={facultyResult.error} />
      <Feedback />
      <Contact settings={settings} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeLoadingGate>
        <HomeContent />
      </HomeLoadingGate>
    </Suspense>
  );
}
