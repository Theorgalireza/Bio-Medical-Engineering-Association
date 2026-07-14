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
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-gradient-to-b
        from-primary
        via-primaryLight/20
        to-primary
        py-20
      "
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div
          className="
            absolute
            top-0
            right-0
            h-80
            w-80
            translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-accent/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            h-60
            w-60
            -translate-x-1/2
            translate-y-1/2
            rounded-full
            bg-signal/5
            blur-3xl
          "
        />

      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
              transition={{
                duration: 0.5,
                delay: idx * 0.1,
              }}
              className="group relative"
            >
              <div
                className="
                  absolute
                  inset-0
                  rounded-2xl
                  bg-gradient-to-br
                  from-accent/10
                  to-signal/10
                  opacity-0
                  blur-xl
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />

              <div
                className="
                  relative
                  rounded-2xl
                  border
                  border-borderSoft
                  bg-primaryLight/40
                  p-6
                  text-center
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-accent/50
                  hover:-translate-y-1
                  hover:shadow-[0_12px_30px_rgba(0,212,255,0.15)]
                "
              >
                <div className="mb-3 text-3xl">
                  {stat.icon}
                </div>

                <div className="mb-2 text-2xl font-bold text-accent md:text-3xl">
                  {stat.number}
                </div>

                <div className="text-xs text-gray-400 md:text-sm">
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