"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getGalleryItems } from "@/lib/api";
import type { GalleryItem } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NeonButton from "@/components/ui/NeonButton";
import AsyncState from "@/components/ui/AsyncState";

const MAX_ITEMS_HOME = 6;

type Props = { items?: GalleryItem[]; initialError?: boolean };

export default function GallerySection({ items, initialError = false }: Props) {
  const [gallery, setGallery] = useState<GalleryItem[]>(items ?? []);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    initialError ? "error" : items ? "ready" : "loading"
  );
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const itemsToShow = useMemo(() => gallery.slice(0, MAX_ITEMS_HOME), [gallery]);

  const load = () => {
    setStatus("loading");
    getGalleryItems()
      .then((data) => {
        setGallery(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    if (items) {
      setGallery(items);
      setStatus(initialError ? "error" : "ready");
      return;
    }

    load();
  }, [items, initialError]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    const maxScroll = Math.max(scrollWidth - clientWidth, 0);
    const normalizedScrollLeft = Math.abs(scrollLeft);

    const isAtStart = normalizedScrollLeft <= 5;
    const isAtEnd = normalizedScrollLeft >= maxScroll - 5 || maxScroll <= 5;

    // در چیدمان RTL، اسکرول به سمت چپ یعنی حرکت رو به جلو (سمت پایان لیست)
    // و اسکرول به سمت راست یعنی بازگشت رو به عقب (سمت ابتدای لیست).
    setCanScrollLeft(!isAtEnd);
    setCanScrollRight(!isAtStart);
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320;
    const offset = direction === "left" ? -scrollAmount : scrollAmount;

    container.scrollBy({
      left: offset,
      behavior: "smooth",
    });

    window.setTimeout(updateScrollState, 350);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const frame = requestAnimationFrame(() => {
      updateScrollState();
    });

    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <section id="gallery" className="relative overflow-hidden bg-surface py-24">
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="text-right">
            <span className="text-sm tracking-widest text-accent">
              گالری تصاویر
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              لحظات انجمن
            </h2>
          </div>

          <NeonButton href="/gallery" variant="outline" className="hidden md:inline-flex">مشاهده گالری کامل ↶</NeonButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollState}
            className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 md:gap-6"
          >
            {status !== "ready" || itemsToShow.length === 0 ? (
              <div className="w-full">
                <AsyncState
                  status={status === "ready" ? "empty" : status}
                  empty="هنوز تصویری در گالری ثبت نشده است."
                  onRetry={load}
                />
              </div>
            ) : itemsToShow.map((item) => (
              <button
                type="button"
                onClick={() => setSelected(item)}
                key={item.id}
                className="w-[260px] shrink-0 overflow-hidden rounded-2xl border border-[#1e2d4a] bg-[#0d1526] text-right shadow-lg transition hover:border-accent/60 md:w-[320px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-white md:text-lg">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-400 md:text-sm">
                      {item.description}
                    </p>
                  )}

                  {(item.category || item.date) && (
                    <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 md:text-xs">
                      {item.category && <span>{item.category}</span>}
                      {item.date && <span>{item.date}</span>}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          {selected && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
              onClick={() => setSelected(null)}
            >
              <div
                className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-sm text-white"
                  aria-label="بستن تصویر"
                >
                  ×
                </button>
                <img src={selected.imageUrl} alt={selected.title} className="max-h-[78vh] w-auto object-contain" />
                <p className="px-5 py-3 text-sm text-white">{selected.title}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/80 p-2 text-white transition-opacity disabled:opacity-0"
            aria-label="اسکرول به چپ"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary/80 p-2 text-white transition-opacity disabled:opacity-0"
            aria-label="اسکرول به راست"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
