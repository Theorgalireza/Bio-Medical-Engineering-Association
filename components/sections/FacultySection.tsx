"use client";

import { motion } from "framer-motion";
import { facultyMembers } from "@/data/mockData";
import { useLanguage } from "@/lib/LanguageContext";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

export default function Faculty() {
  const { t } = useLanguage();

  return (
    <section id="faculty" className="relative py-24 bg-surface overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-neonPurple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-accent tracking-widest">{t("faculty", "label")}</span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-2">
            {t("faculty", "title")}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full shadow-neon" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {facultyMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={item}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl border border-borderSoft bg-primaryLight/60 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:border-accent/60 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)]"
            >
              {/* Avatar: first letter of name inside a neon-ringed circle */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-accent/40 group-hover:border-accent transition-colors duration-300" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-electric/20 to-neonPurple/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent text-glow">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -inset-1 rounded-full border border-accent/20 group-hover:animate-pulseGlow" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-xs text-signal mb-3">{member.title}</p>

              <div className="flex flex-wrap justify-center gap-1.5">
                {member.specialties.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
