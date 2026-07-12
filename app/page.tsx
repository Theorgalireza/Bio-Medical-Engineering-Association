import Link from "next/link";
import Hero from "@/components/sections/Hero";
import CTASection from "@/components/sections/CTASection";
import StatsSection from "@/components/sections/StatsSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import PublicationsSection from "@/components/sections/PublicationsSection";
import FacultySection from "@/components/sections/FacultySection";
import Feedback from "@/components/sections/FeedbackSection";
import Contact from "@/components/sections/ContactSection";
import NeonButton from "@/components/ui/NeonButton";

export default function Home() {
  return (
    <main>
      <Hero />
      <CTASection />
      <StatsSection />
      
      <section id="announcements" className="py-4">
        <AnnouncementsSection />
        <div className="flex justify-center mt-10 pb-8">
          <Link href="/announcements" className="inline-block">
            <NeonButton variant="outline">مشاهده تمام اخبار ↶</NeonButton>
          </Link>
        </div>
      </section>

      <PublicationsSection />
      <div className="flex justify-center mt-10 pb-12">
        <Link href="/articles" className="inline-block">
          <NeonButton variant="outline">مشاهده تمام مقالات ↶</NeonButton>
        </Link>
      </div>

      <section id="faculty">
        <FacultySection />
      </section>

      <section id="survey">
        <Feedback />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
