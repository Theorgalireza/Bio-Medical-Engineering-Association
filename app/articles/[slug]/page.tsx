import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/mockData";
import NeonButton from "@/components/ui/NeonButton";

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

export default function ArticlePage({ params }: Props) {

  const article = articles.find(
    (item) => item.slug === params.slug
  );

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

        <div className="mt-8">
          <ArticleCover />
        </div>

        <div className="mt-12">

          <span className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent text-accent text-sm">
            {article.category}
          </span>

          <h1 className="text-white text-4xl md:text-5xl font-bold leading-relaxed mt-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-500 mt-8 text-sm">

            <span>
              نویسنده:
              {" "}
              {article.authors.join("، ")}
            </span>

            <span>
              سال انتشار:
              {" "}
              {article.year}
            </span>

            <span>
              زمان مطالعه:
              {" "}
              {article.readingTime}
              {" "}
              دقیقه
            </span>

          </div>

          <div className="mt-10 p-8 rounded-3xl bg-primaryLight border border-borderSoft">

            <p className="text-gray-300 leading-9 text-justify">
              {article.content ??
                `
این صفحه نسخه اولیه نمایش مقاله است.

در این قسمت متن کامل مقاله نمایش داده می‌شود.

در آینده می‌توانید این محتوا را از API،
Headless CMS یا دیتابیس دریافت کنید.

طراحی صفحه به گونه‌ای انجام شده که برای مقالات بلند نیز مناسب باشد و خوانایی بالایی داشته باشد.

همچنین امکان افزودن تصاویر، کد، فرمول‌های ریاضی، ویدئو و منابع نیز به راحتی وجود دارد.
`}
            </p>

          </div>

          <div className="flex gap-4 mt-12">

            <Link href="/articles">
              <NeonButton variant="outline">
                بازگشت
              </NeonButton>
            </Link>

            <NeonButton>
              دانلود PDF
            </NeonButton>

          </div>

        </div>

      </section>

    </main>
  );
}