"use client";

import { motion } from "framer-motion";

const quickLinks = [
  { label: "خانه", href: "#home" },
  { label: "اعلامیه‌ها", href: "#announcements" },
  { label: "نشریات", href: "#publications" },
  { label: "هیئت علمی", href: "#faculty" },
  { label: "ارتباط با ما", href: "#contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const persianYear = currentYear + 579;
  
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
            <h3 className="text-lg font-bold text-white mb-4">
              Association <span className="text-accent">Bio Medical Engineer</span>
            </h3>
            <p className="text-sm text-gray-400 leading-6">
              انجمن علمی مهندسی پزشکی، گرایش بیوالکتریک، دانشگاه شهید بهشتی.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">لینک‌های سریع</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-accent rounded-full" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">فعالیت‌ها</h4>
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
                <span className="w-1 h-1 bg-signal rounded-full" />
                منتشر مقالات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-signal rounded-full" />
                همکاری‌های تحقیقاتی
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">تماس با ما</h4>
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
            © 2026-2027 Alireza Jafary
            <br />
            طراحی و توسعه با ❤️ برای انجمن
          </p>
        </div>
      </div>
    </footer>
  );
}
