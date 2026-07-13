"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { galleryItems } from "@/data/mockData";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import NeonButton from "@/components/ui/NeonButton";

const MAX_ITEMS_HOME = 6;

export default function GallerySection() {
  // این مقادیر اولیه باید درست باشند:
  // canScrollLeft: false (چون اولش نمی‌تونیم به چپ بریم)
  // canScrollRight: true (اگر بیش از MAX_ITEMS_HOME آیتم داریم، اولش می‌تونیم به راست بریم)
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  // مقدار اولیه canScrollRight را بر اساس تعداد کل آیتم‌ها و MAX_ITEMS_HOME تعیین می‌کنیم
  const [canScrollRight, setCanScrollRight] = useState(galleryItems.length > MAX_ITEMS_HOME); 
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // محاسبه دقیق‌تر وضعیت اسکرول
    const isAtStart = scrollLeft <= 0; 
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // تلورانس کوچک

    // فعال کردن دکمه چپ زمانی که به ابتدا نرسیده‌ایم
    setCanScrollLeft(!isAtStart); 
    // فعال کردن دکمه راست زمانی که به انتها نرسیده‌ایم
    setCanScrollRight(!isAtEnd); 
  };

  const scroll = (scrollOffset: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
  };

  const itemsToShow = galleryItems.slice(0, MAX_ITEMS_HOME);

  useEffect(() => {
    // استفاده از requestAnimationFrame برای اطمینان از اجرای بعد از رندر و محاسبه ابعاد
    const animationFrameId = requestAnimationFrame(() => {
      handleScroll();
    });

    // اگر تعداد کل آیتم‌ها کمتر یا مساوی MAX_ITEMS_HOME باشد، نیازی به دکمه راست نیست
    if (galleryItems.length <= MAX_ITEMS_HOME) {
      setCanScrollRight(false);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, []); // اجرا فقط یک بار پس از اولین رندر

  return (
    <section
      id="gallery"
      className="relative py-24 bg-surface overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="text-right">
            <span className="text-sm text-accent tracking-widest">
              گالری تصاویر
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
              لحظات انجمن
            </h2>
          </div>

          <Link href="/gallery" className="hidden md:inline-block">
            <NeonButton variant="outline">مشاهده گالری کامل ↶</NeonButton>
          </Link>
        </motion.div>

        {/* Container اصلی برای اسکرول */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            // dir="ltr" را حذف کنید چون ممکن است با RTL اصلی سایت تداخل کند
            className="
              flex gap-4 md:gap-6 
              overflow-x-auto  
              pb-4
              snap-x snap-mandatory
              scrollbar-hide 
            "
          >
            {itemsToShow.map((item, index) => (
              <article
                key={item.id}
                className="
                  snap-start 
                  shrink-0 
                  w-[260px] md:w-[320px]
                  overflow-hidden 
                  rounded-2xl 
                  border border-[#1e2d4a] 
                  bg-[#0d1526] 
                  shadow-lg
                "
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-base md:text-lg">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-400 text-xs md:text-sm mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {(item.category || item.date) && (
                    <div className="flex items-center justify-between text-[11px] md:text-xs text-gray-500 mt-3">
                      {item.category && <span>{item.category}</span>}
                      {item.date && <span>{item.date}</span>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* دکمه‌های Arrow */}
          <AnimateArrowButton
            direction="left"
            onClick={() => scroll(-300)} 
            disabled={!canScrollLeft}
          />
          <AnimateArrowButton
            direction="right"
            onClick={() => scroll(300)} 
            disabled={!canScrollRight}
          />
        </motion.div>
      </div>
    </section>
  );
}

// کامپوننت کمکی برای دکمه‌های Arrow
interface AnimateArrowButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}

const AnimateArrowButton: React.FC<AnimateArrowButtonProps> = ({
  direction,
  onClick,
  disabled,
}) => {
  const buttonVariants = {
    hidden: { opacity: 0, x: direction === "left" ? -20 : 20 },
    visible: { opacity: 1, x: 0 },
  };

  const positionClass =
    direction === "left"
      ? "left-0"
      : "right-0";
  
  const iconComponent = direction === "left" ? <ChevronLeft size={24} /> : <ChevronRight size={24} />;

  return (
    <motion.button
      variants={buttonVariants}
      initial="hidden" 
      animate={!disabled ? "visible" : "hidden"} 
      exit="hidden"
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-primary/70 hover:bg-primary disabled:opacity-50 transition-colors duration-300 ${positionClass}`}
      aria-label={`Scroll ${direction}`}
    >
      {iconComponent}
    </motion.button>
  );
};
