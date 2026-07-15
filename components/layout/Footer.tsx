"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const quickLinks = [
  { label: "خانه", href: "/#home" },
  { label: "اعلامیه‌ها", href: "/#announcements" },
  { label: "نشریات", href: "/#publications" },
  { label: "هیئت علمی", href: "/#faculty" },
  { label: "ارتباط با ما", href: "/#contact" },
];

export default function Footer() {
  const currentYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
  }).format(new Date());

  return (
    <footer className="relative bg-gradient-to-t from-primary/80 to-primary border-t border-accent/20 pt-20 pb-10 overflow-hidden">
      {/* Animated ECG line */}
      <div className="absolute top-0 inset-x-0 h-10 opacity-60">
        <svg
          viewBox="0 0 1200 60"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 30 H400 L420 10 L440 50 L460 30 H700 L720 5 L740 55 L760 30 H1200"
            fill="none"
            stroke="#00D4FF"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="drop-shadow-[0_0_6px_#00D4FF]"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              انجمن علمی <span className="text-accent">مهندسی پزشکی</span>
            </h3>
            <p className="text-sm leading-6 text-gray-400">
              انجمن علمی مهندسی پزشکی، گرایش بیوالکتریک، دانشگاه شهید بهشتی.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">لینک‌های سریع</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-gray-400 transition-colors duration-200 hover:text-accent"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">فعالیت‌ها</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-signal rounded-full" />
                رویدادهای علمی
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-signal rounded-full" />
                کارگاه‌های آموزشی
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-signal" />
                انتشار مقالات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-signal rounded-full" />
                همکاری‌های تحقیقاتی
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">تماس با ما</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li>
                <span className="block text-xs text-gray-500 mb-1">آدرس</span>
                دانشگاه شهید بهشتی، دانشکده مهندسی پزشکی، تهران
              </li>
              <li>
                <span className="block text-xs text-gray-500 mb-1">ایمیل</span>
                <a href="mailto:bioelectric@sbu.ac.ir" className="hover:text-accent transition-colors">
                  bioelectric@sbu.ac.ir
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-borderSoft text-center">
<p className="text-xs text-gray-500">
  © {currentYear}
  <br />
  <span className="inline-flex items-center gap-1">
    طراحی و توسعه با
    <Heart className="h-3 w-3 text-cyan-400" aria-label="love" />
    برای انجمن
  </span>
</p>

        </div>
      </div>
    </footer>
  );
}
