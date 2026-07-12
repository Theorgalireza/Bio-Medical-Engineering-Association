import { notFound } from "next/navigation";
import Link from "next/link";
import { announcements } from "@/data/mockData";
import NeonButton from "@/components/ui/NeonButton";

interface Props {
  params: {
    slug: string;
  };
}

export default function AnnouncementPage({ params }: Props) {
  const announcement = announcements.find((item) => item.slug === params.slug);

  if (!announcement) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary pt-24 pb-20">
      <section className="max-w-5xl mx-auto px-4">
        <Link href="/announcements" className="text-accent hover:text-signal transition">
          ← بازگشت به اخبار انجمن
        </Link>

        <div className="mt-8 rounded-3xl border border-borderSoft bg-primaryLight/80 overflow-hidden shadow-glowAccent">
          {announcement.imageUrl && (
            <img
              src={announcement.imageUrl}
              alt={announcement.title}
              className="w-full h-72 object-cover"
            />
          )}

          <div className="p-10">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent text-accent text-sm">
              {announcement.type}
            </span>

            <h1 className="text-white text-4xl md:text-5xl font-bold mt-6 leading-relaxed">
              {announcement.title}
            </h1>

            <div className="mt-4 text-sm text-gray-400 flex flex-wrap gap-4">
              <span>{announcement.date}</span>
              {announcement.isNew && <span className="text-neonGreen">جدید</span>}
            </div>

            <p className="mt-8 text-gray-300 leading-8 text-justify">
              {announcement.description}
            </p>

            <div className="mt-10 flex gap-4">
              <Link href="/announcements">
                <NeonButton variant="outline">بازگشت</NeonButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
