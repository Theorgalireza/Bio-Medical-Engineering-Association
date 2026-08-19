 "use client";

import { useEffect, useState } from "react";
import NeonButton from "@/components/ui/NeonButton";
import { getGalleryItems } from "@/lib/api";
import type { GalleryItem } from "@/types";
import AsyncState from "@/components/ui/AsyncState";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const load = () => {
    setStatus("loading");
    getGalleryItems()
      .then((data) => {
        setGalleryItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-primary py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm tracking-widest text-accent">آرشیو تصویری</span>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">گالری کامل تصاویر</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
              تصاویر رویدادها، جلسات و فعالیت‌های انجمن را در یک نمای منظم و قابل مرور ببینید.
            </p>
          </div>
          <NeonButton href="/" variant="outline">بازگشت به صفحه اصلی</NeonButton>
        </div>

        {status !== "ready" || galleryItems.length === 0 ? (
          <AsyncState
            status={status === "ready" ? "empty" : status}
            empty="هنوز تصویری برای نمایش ثبت نشده است."
            onRetry={load}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                className="overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight/60 text-right transition hover:border-accent/60"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-4 md:p-5">
                  <h2 className="font-semibold text-white">{item.title}</h2>
                  {item.description && <p className="mt-2 text-sm leading-7 text-gray-400">{item.description}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
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
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="بستن تصویر"
              className="absolute left-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-white"
            >
              ×
            </button>
            <img src={selected.imageUrl} alt={selected.title} className="max-h-[78vh] w-auto object-contain" />
            <div className="px-5 py-3">
              <h2 className="font-semibold text-white">{selected.title}</h2>
              {selected.description && <p className="mt-1 text-sm text-gray-400">{selected.description}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
