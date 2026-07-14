import { notFound } from "next/navigation";
import Link from "next/link";
import NeonButton from "@/components/ui/NeonButton";
import { getArticleBySlug } from "@/lib/api";

interface Props {
  params: {
    slug: string;
  };
}

function ArticleCover() {
  return (
    <div className="relative h-[380px] rounded-3xl overflow-hidden bg-primaryLight border border-borderSoft">

      <svg
        viewBox="0 0 1200 400"
        className="absolute inset-0 w-full h-full opacity-70"
      >
        <defs>
          <pattern
            id="grid"
            width="35"
            height="35"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 17.5H35M17.5 0V35"
              stroke="#1A2645"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
        />

        <path
          d="
          M0 200
          L120 200
          L170 120
          L230 280
          L290 200
          L390 200
          L460 90
          L540 310
          L620 200
          L760 200
          L820 150
          L900 260
          L980 200
          L1200 200
          "
          fill="none"
          stroke="#7DF9FF"
          strokeWidth="4"
        />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10" />
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary pt-24 pb-20">

      <section className="max-w-5xl mx-auto px-4">

        <Link
          href="/articles"
          className="text-accent hover:text-signal transition"
        >
          ← بازگشت به مقالات
        </Link>

        <div className="mt-8 space-y-8">

          <ArticleCover />

          <div className="space-y-6">

            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
              <span className="inline-block px-3 py-1 rounded-full bg-surface border border-borderSoft">
                {article.category}
              </span>

              <span className="inline-block px-3 py-1 rounded-full bg-surface border border-borderSoft">
                {article.year}
              </span>

              <span className="inline-block px-3 py-1 rounded-full bg-surface border border-borderSoft">
                {article.readingTime} دقیقه مطالعه
              </span>
            </div>

            <h1 className="text-white text-4xl md:text-5xl font-bold leading-relaxed">
              {article.title}
            </h1>

            <p className="text-gray-400 leading-8 text-justify">
              {article.summary}
            </p>

            <div className="rounded-2xl border border-borderSoft bg-primaryLight/80 p-8 text-gray-300 leading-8 text-justify whitespace-pre-line">
              {article.content}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-sm text-gray-500">
              {article.authors.map((author) => (
                <span
                  key={author}
                  className="inline-block px-3 py-1 rounded-full bg-surface border border-borderSoft"
                >
                  {author}
                </span>
              ))}
            </div>

            <div className="pt-6">
              <NeonButton href="/articles" variant="outline">بازگشت به مقالات</NeonButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
