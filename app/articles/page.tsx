"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { getArticles } from "@/lib/api";
import type { Article } from "@/types";

function ArticleCover({ seed }: { seed: number }) {
  const hue = (seed * 53) % 360;

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl bg-primaryLight">
      <svg
        viewBox="0 0 500 260"
        className="absolute inset-0 w-full h-full opacity-70"
      >
        <defs>
          <pattern
            id={`grid-${seed}`}
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 15H30M15 0V30"
              stroke="#1A2645"
              strokeWidth="1"
            />
            <circle
              cx="15"
              cy="15"
              r="1.6"
              fill="#00D4FF"
              opacity=".45"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />

        <path
          d="
          M0 130
          L60 130
          L90 80
          L120 190
          L150 130
          L210 130
          L240 60
          L270 200
          L300 130
          L360 130
          L390 90
          L420 180
          L450 130
          L500 130
        "
          stroke="#7DF9FF"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 20%, hsla(${hue},90%,60%,0.18), transparent 60%)`,
        }}
      />
    </div>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let mounted = true;
    getArticles()
      .then((data) => mounted && setArticles(data))
      .catch(() => mounted && setArticles([]));

    return () => {
      mounted = false;
    };
  }, []);

  const featured = articles.find((a) => a.featured);
  const list = articles.filter((a) => !a.featured);

  return (
    <main className="min-h-screen bg-primary pt-24 pb-20">

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <span className="text-accent tracking-widest text-sm">
            انجمن علمی مهندسی پزشکی
          </span>

          <h1 className="text-white text-4xl md:text-6xl font-bold mt-5 leading-relaxed">
            مقالات علمی
          </h1>

          <p className="text-gray-400 mt-6 max-w-3xl leading-8">
            مجموعه‌ای از مقالات، پژوهش‌ها و مطالب تخصصی در حوزه
            مهندسی پزشکی، بیوالکتریک، علوم اعصاب و فناوری‌های نوین.
          </p>

          <div className="mt-8">
            <Link href="/" className="inline-block">
              <NeonButton variant="outline">بازگشت به صفحه اصلی</NeonButton>
            </Link>
          </div>

        </motion.div>

      </section>

      {/* Featured */}

      {featured && (

        <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >

            <ArticleCover seed={1} />

            <div>

              <span className="text-signal">
                مقاله ویژه
              </span>

              <h2 className="text-white text-3xl font-bold mt-4 leading-relaxed">
                {featured.title}
              </h2>

              <p className="text-gray-400 mt-6 leading-8">
                {featured.summary}
              </p>

              <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-500">

                <span>{featured.category}</span>

                <span>•</span>

                <span>{featured.year}</span>

                <span>•</span>

                <span>{featured.readingTime} دقیقه</span>

              </div>

              <Link
                href={`/articles/${featured.slug}`}
                className="inline-block mt-10"
              >
                <NeonButton>
                  مطالعه مقاله
                </NeonButton>
              </Link>

            </div>

          </motion.div>

        </section>

      )}

      {/* Grid */}

      <section className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {list.map((article, index) => (

            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * .08
              }}
              whileHover={{
                y: -8,
                scale: 1.02
              }}
              className="rounded-2xl overflow-hidden border border-borderSoft bg-primaryLight/60 backdrop-blur"
            >

              <ArticleCover seed={index + 2} />

              <div className="p-6">

                <span className="text-signal text-xs">
                  {article.category}
                </span>

                <h3 className="text-white font-bold text-lg mt-3 leading-8 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-400 mt-4 text-sm leading-7 line-clamp-3">
                  {article.summary}
                </p>

                <div className="flex justify-between text-xs text-gray-500 mt-6">

                  <span>{article.year}</span>

                  <span>{article.readingTime} دقیقه</span>

                </div>

                <Link
                  href={`/articles/${article.slug}`}
                  className="block mt-6"
                >
                  <NeonButton
                    variant="outline"
                    className="w-full"
                  >
                    مشاهده مقاله
                  </NeonButton>
                </Link>

              </div>

            </motion.div>

          ))}

        </div>

      </section>

    </main>
  );
}