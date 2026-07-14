import NeonButton from "@/components/ui/NeonButton";
import { getGalleryItems } from "@/lib/api";

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

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

        {galleryItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-borderSoft bg-primaryLight/40 px-6 py-20 text-center text-sm text-gray-400">
            هنوز تصویری برای نمایش ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-borderSoft bg-primaryLight/60">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-4 md:p-5">
                  <h2 className="font-semibold text-white">{item.title}</h2>
                  {item.description && <p className="mt-2 text-sm leading-7 text-gray-400">{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
