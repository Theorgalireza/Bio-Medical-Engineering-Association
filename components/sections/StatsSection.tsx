"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "۲۵۰+", label: "اعضای فعال", icon: "" },
  { number: "۴۵", label: "مقاله و پروژه", icon: "" },
  { number: "۱۸", label: "رویداد برگزار شده", icon: "" },
  { number: "۲+", label: "سال فعالیت", icon: "" },
];

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-primary via-primaryLight/20 to-primary overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-signal/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-signal/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative p-6 rounded-2xl border border-borderSoft bg-primaryLight/40 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 text-center">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
