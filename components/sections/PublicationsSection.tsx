"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { publications } from "@/data/mockData";
import SyntheticCover from "@/components/ui/WaveformIcon"; // اگر SyntheticCover در مسیر دیگری است، این را اصلاح کن

const PublicationsSection = () => {
  return (
    <section
      id="publications"
      className="relative py-24 bg-gradient-to-b from-background via-surface to-background"
    >
      {/* پس زمینه گرافیکی */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -right-32 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* هدر بخش */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              نشریات و مقالات علمی
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-400 max-w-xl leading-7">
              منتخب نشریات و ویژه‌نامه‌های انجمن علمی مهندسی پزشکی با تمرکز بر
              بیوالکتریک، علوم اعصاب محاسباتی و فناوری‌های نوین.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface/80 border border-borderSoft">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              آرشیو نشریات در حال توسعه
            </span>
          </div>
        </div>

        {/* گرید نشریات */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {publications.map((pub, idx) => (
  <Link
    key={pub.id}
    href={`/articles/${pub.slug}`}   // یا مسیر دلخواهت، اگر بعداً slug را اضافه کنی
    className="block"               // فقط بلوکی‌کردن لینک، بدون group
  >
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      whileHover={{ rotateX: 4, rotateY: -6, scale: 1.02 }}  // ← همون hover قبلی، دست نخورده
      style={{ transformStyle: "preserve-3d" }}
      className="cursor-pointer rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm overflow-hidden transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(0,212,255,0.15)]"
    >
      <SyntheticCover seed={idx} />

      <div className="p-6">
        <span className="text-xs text-signal">
          {pub.category}
        </span>

        <h3 className="text-base font-bold text-white mt-2 mb-2 leading-7 line-clamp-2">
          {pub.title}
        </h3>

        <p className="text-sm text-gray-400 leading-6 mb-4 line-clamp-2">
          {pub.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-borderSoft pt-3">
          <span>{pub.authors?.join("، ") || "نامشخص"}</span>
          <span className="text-electric">{pub.year}</span>
        </div>
      </div>
    </motion.article>
  </Link>
))}

        </motion.div>
      </div>
    </section>
  );
};

export default PublicationsSection;
