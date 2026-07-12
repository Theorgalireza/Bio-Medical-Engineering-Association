"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NeonButton from "@/components/ui/NeonButton";

export default function CTASection() {
  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(0,212,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(194,123,255,0.1) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm mb-6">
            درباره انجمن
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            انجمن علمی <span className="text-accent"></span>
            <br />
          
          </h2>

          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            ما یک انجمن علمی فعال و پویا برای دانشجویان مهندسی پزشکی هستیم که در
            حوزه‌های فرهنگی, آموزشی و علمی فعالیت می‌کنیم. هدف ما ارتقای دانش، تبادل تجربیات و ایجاد
            فرصت‌های سرنوشت ساز است.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/articles" className="w-full sm:w-auto">
              <NeonButton className="w-full">
                بیشتر بخوانید
              </NeonButton>
            </Link>
            <a href="#contact" className="w-full sm:w-auto">
              <NeonButton variant="outline" className="w-full">
                تماس با ما
              </NeonButton>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
