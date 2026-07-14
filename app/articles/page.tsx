"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { getArticles } from "@/lib/api";
import type { Article } from "@/types";

function ArticleCover({ seed }: { seed: number }) {
  const hue = (seed * 53) % 360;

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl bg-primaryLight">
      <svg viewBox="0 0 500 260" className="absolute inset-0 h-full w-full opacity-70">
        <defs>
          <pattern id={`grid-${seed}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M0 15H30M15 0V30" stroke="#1A2645" strokeWidth="1" />
            <circle cx="15" cy="15" r="1.6" fill="#00D4FF" opacity=".45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />
        <path
          d="M0 130L60 130L90 80L120 190L150 130L210 130L240 60L270 200L300 130L360 130L390 90L420 180L450 130L500 130"
          stroke="#7DF9FF"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 70% 20%, hsla(${hue},90%,60%,0.18), transparent 60%)` }} />
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
      <section className="mx-auto mb-16 max-w-7xl px-4 md:px-8">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="text-sm tracking-widest text-accent">انجمن علمی مهندسی پزشکی</span>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">مقالات علمی</h1>
          <p className="max-w-3xl leading-8 text-gray-400">
            مجموعه‌ای از مقالات، پژوهش‌ها و مطالب تخصصی در حوزه مهندسی پزشکی، بیوالکتریک، علوم اعصاب و فناوری‌های نوین.
          </p>
          <NeonButton href="/" variant="outline">بازگشت به صفحه اصلی</NeonButton>
        </motion.div>
      </section>

      {featured && (
        <section className="mx-auto mb-24 max-w-7xl px-4 md:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid items-center gap-12 lg:grid-cols-2">
            <ArticleCover seed={1} />
            <div>
              <span className="text-signal">مقاله ویژه</span>
              <h2 className="mt-4 text-3xl font-bold leading-relaxed text-white">{featured.title}</h2>
              <p className="mt-6 leading-8 text-gray-400">{featured.summary}</p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{featured.category}</span>
                <span>•</span>
                <span>{featured.year}</span>
                <span>•</span>
                <span>{featured.readingTime} دقیقه</span>
              </div>
              <NeonButton href={`/articles/${featured.slug}`} className="mt-10">مطالعه مقاله</NeonButton>
            </div>
          </motion.div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 md:px-8">
        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-borderSoft bg-primaryLight/40 px-6 py-20 text-center text-sm text-gray-400">
            هنوز مقاله‌ای برای نمایش ثبت نشده است.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur"
              >
                <ArticleCover seed={index + 2} />
                <div className="p-6">
                  <span className="text-xs text-signal">{article.category}</span>
                  <h3 className="mt-3 text-lg font-bold leading-8 text-white line-clamp-2">{article.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-gray-400 line-clamp-3">{article.summary}</p>
                  <div className="mt-6 flex justify-between text-xs text-gray-500">
                    <span>{article.year}</span>
                    <span>{article.readingTime} دقیقه</span>
                  </div>
                  <NeonButton href={`/articles/${article.slug}`} variant="outline" className="mt-6 w-full">مشاهده مقاله</NeonButton>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
