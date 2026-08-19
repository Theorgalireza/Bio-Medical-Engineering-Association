"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import SyntheticCover from "@/components/ui/WaveformIcon";
import { getArticles } from "@/lib/api";
import type { Article } from "@/types";
import AsyncState from "@/components/ui/AsyncState";

type Props = { items?: Article[]; initialError?: boolean };

const PublicationsSection = ({ items, initialError = false }: Props) => {
  const [publicationItems, setPublicationItems] = useState<Article[]>(items ?? []);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    initialError ? "error" : items ? "ready" : "loading"
  );

  const load = () => {
    setStatus("loading");
    getArticles()
      .then((data) => {
        setPublicationItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    if (items) {
      setPublicationItems(items);
      setStatus(initialError ? "error" : "ready");
      return;
    }

    load();
  }, [items, initialError]);

  return (
    <section
      id="publications"
      className="relative isolate overflow-hidden bg-gradient-to-b from-primary via-surface to-primary py-24"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <div
          className="
            absolute
            left-0
            top-0
            h-64
            w-64
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-primary/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-0
            top-40
            h-72
            w-72
            translate-x-1/2
            rounded-full
            bg-neonPurple/20
            blur-3xl
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              نشریات و مقالات علمی
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
              منتخب نشریات و ویژه‌نامه‌های انجمن علمی مهندسی پزشکی با تمرکز بر
              بیوالکتریک، علوم اعصاب محاسباتی و فناوری‌های نوین.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface/80 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              آرشیو نشریات در حال توسعه
            </span>
          </div>
        </div>

        {status !== "ready" || publicationItems.length === 0 ? (
          <AsyncState
            status={status === "ready" ? "empty" : status}
            empty="هنوز مقاله‌ای منتشر نشده است."
            onRetry={load}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {publicationItems.map((pub, idx) => {
              return (
                <Link
                  key={pub.id}
                  href={`/articles/${pub.slug}`}
                  className="block"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    whileHover={{
                      rotateX: 4,
                      rotateY: -6,
                      scale: 1.02,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="cursor-pointer overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_15px_40px_rgba(0,212,255,0.15)]"
                  >
                    <SyntheticCover seed={idx} />

                    <div className="p-6">
                      <span className="text-xs text-signal">
                        {pub.category}
                      </span>

                      <h3 className="mb-2 mt-2 line-clamp-2 text-base font-bold leading-7 text-white">
                        {pub.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-400">
                        {pub.summary}
                      </p>

                      <div className="flex items-center justify-between border-t border-borderSoft pt-3 text-xs text-gray-500">
                        <span>
                          {pub.authors?.join("، ") || "نامشخص"}
                        </span>

                        <span className="text-electric">
                          {pub.year}
                        </span>
                      </div>
                      <span className="mt-4 inline-flex text-sm font-medium text-accent">
                        مطالعه مقاله ←
                      </span>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PublicationsSection;
