export default function MediaPage() {
  return (
    <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
      <h1 className="mb-3 text-xl font-bold text-white">آرشیو رسانه‌ها</h1>
      <p className="leading-8">
        در بک‌اند فعلی، ماژول مستقلی برای مدیریت رسانه یا آرشیو ویدئو وجود ندارد. این مسیر فقط به‌عنوان جایگاه موقت باقی مانده و به صفحه گالری یا بخش‌های آینده می‌تواند متصل شود.
      </p>
      <a href="/admin/gallery" className="mt-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/15">
        رفتن به گالری
      </a>
    </div>
  );
}
