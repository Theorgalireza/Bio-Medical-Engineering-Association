"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFacultyMembers } from "@/lib/api";
import type { FacultyMember } from "@/types";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

type Props = { items?: FacultyMember[] };

export default function Faculty({ items }: Props) {
  const [facultyItems, setFacultyItems] = useState<FacultyMember[]>(items ?? []);

  useEffect(() => {
    if (items) {
      setFacultyItems(items);
      return;
    }

    let mounted = true;
    getFacultyMembers()
      .then((data) => mounted && setFacultyItems(data))
      .catch(() => mounted && setFacultyItems([]));

    return () => {
      mounted = false;
    };
  }, [items]);

  return (
    <section id="faculty" className="relative overflow-hidden bg-surface py-24">
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-neonPurple/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="tracking-widest text-sm text-accent">تیم علمی</span>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-4xl">
            اعضای هیئت علمی و مشاوران
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent shadow-neon" />
        </motion.div>

        {facultyItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-borderSoft bg-primaryLight/40 px-6 py-14 text-center text-sm text-gray-400">
            هنوز عضوی برای نمایش ثبت نشده است.
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {facultyItems.map((member) => (
              <motion.div
                key={member.id}
                variants={item}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl border border-borderSoft bg-primaryLight/60 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]"
              >
                <div className="relative mx-auto mb-4 h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-2 border-accent/40 transition-colors duration-300 group-hover:border-accent" />
                  <div className="absolute inset-1 flex items-center justify-center rounded-full bg-gradient-to-br from-electric/20 to-neonPurple/20">
                    <span className="text-2xl font-bold text-accent text-glow">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -inset-1 rounded-full border border-accent/20 group-hover:animate-pulseGlow" />
                </div>

                <h3 className="mb-1 text-base font-bold text-white">{member.name}</h3>
                <p className="mb-3 text-xs text-signal">{member.title}</p>

                <div className="flex flex-wrap justify-center gap-1.5">
                  {member.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] text-accent"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
