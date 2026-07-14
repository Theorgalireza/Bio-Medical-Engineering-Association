"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import WaveformIcon from "@/components/ui/WaveformIcon";
import { getAnnouncements } from "@/lib/api";
import type { Announcement } from "@/types";

const typeStyles: Record<string, string> = {
  رویداد: "bg-electric/10 text-electric border-electric/30",
  کارگاه: "bg-neonGreen/10 text-neonGreen border-neonGreen/30",
  خبر: "bg-accent/10 text-accent border-accent/30",
  مهم: "bg-neonPurple/10 text-neonPurple border-neonPurple/30",
  EVENT: "bg-electric/10 text-electric border-electric/30",
  WORKSHOP: "bg-neonGreen/10 text-neonGreen border-neonGreen/30",
  NEWS: "bg-accent/10 text-accent border-accent/30",
  WEBINAR: "bg-neonPurple/10 text-neonPurple border-neonPurple/30",
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type Props = { items?: Announcement[] };

export default function Announcements({ items }: Props) {
  const [announcementItems, setAnnouncementItems] = useState<Announcement[]>(items ?? []);

  useEffect(() => {
    if (items) {
      setAnnouncementItems(items);
      return;
    }

    let mounted = true;
    getAnnouncements()
      .then((data) => mounted && setAnnouncementItems(data))
      .catch(() => mounted && setAnnouncementItems([]));

    return () => {
      mounted = false;
    };
  }, [items]);

  return (
    <section id="announcements" className="relative overflow-hidden bg-surface py-24">
      <div className="pointer-events-none absolute top-0 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="tracking-widest text-sm text-accent">آخرین رویدادها</span>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">
            اعلامیه‌ها و اخبار انجمن
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent shadow-neon" />
        </motion.div>

        {announcementItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-borderSoft bg-primaryLight/40 px-6 py-14 text-center text-sm text-gray-400">
            هنوز اعلامیه‌ای ثبت نشده است.
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {announcementItems.map((a) => (
              <Link href={`/announcements/${a.slug}`} key={a.id} className="group block">
                <motion.article
                  variants={item}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl border border-borderSoft bg-primaryLight/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-accent/60 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]"
                >
                  {a.isNew && (
                    <span className="absolute -top-3 left-4 rounded-full bg-neonGreen px-2 py-1 text-[10px] font-bold text-primary shadow-[0_0_10px_#39FF14]">
                      جدید
                    </span>
                  )}

                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <WaveformIcon size={20} className="text-accent" />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${
                        typeStyles[a.type] ?? typeStyles.خبر
                      }`}
                    >
                      {a.type}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold leading-7 text-white">
                    {a.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-gray-400">
                    {a.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-borderSoft pt-3 text-xs text-gray-500">
                    <span>{a.date}</span>
                    <span className="text-accent transition-transform duration-300 group-hover:-translate-x-1">
                      ادامه ←
                    </span>
                  </div>
                </motion.article>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
