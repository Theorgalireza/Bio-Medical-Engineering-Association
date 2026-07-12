"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WaveformIcon from "@/components/ui/WaveformIcon";
import { announcements } from "@/data/mockData";
import { useLanguage } from "@/lib/LanguageContext";

const typeStyles: Record<string, string> = {
  رویداد: "bg-electric/10 text-electric border-electric/30",
  کارگاه: "bg-neonGreen/10 text-neonGreen border-neonGreen/30",
  خبر: "bg-accent/10 text-accent border-accent/30",
  مهم: "bg-neonPurple/10 text-neonPurple border-neonPurple/30",
  Event: "bg-electric/10 text-electric border-electric/30",
  Workshop: "bg-neonGreen/10 text-neonGreen border-neonGreen/30",
  News: "bg-accent/10 text-accent border-accent/30",
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

export default function Announcements() {
  const { t } = useLanguage();

  return (
    <section
      id="announcements"
      className="relative py-24 bg-surface overflow-hidden"
    >
      {/* subtle background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-accent tracking-widest">
            {t("announcements", "label")}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            {t("announcements", "title")}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full shadow-neon" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {announcements.map((a) => (
            <Link href={`/announcements/${a.slug}`} key={a.id} className="group block">
              <motion.article
                variants={item}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm p-6 transition-colors duration-300 hover:border-accent/60 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]"
              >
                {a.isNew && (
                  <span className="absolute -top-3 left-4 text-[10px] font-bold px-2 py-1 rounded-full bg-neonGreen text-primary shadow-[0_0_10px_#39FF14]">
                    {t("announcements", "new")}
                  </span>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <WaveformIcon size={20} className="text-accent" />
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      typeStyles[a.type] ?? typeStyles["خبر"]
                    }`}
                  >
                    {a.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-7">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-400 leading-6 mb-4 line-clamp-3">
                  {a.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-borderSoft pt-3">
                  <span>{a.date}</span>
                  <span className="text-accent group-hover:translate-x-[-4px] transition-transform duration-300">
                    {t("announcements", "readMore")}
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
