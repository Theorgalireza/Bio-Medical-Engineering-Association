export default function VideosPage() {
  return (
    <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
      <h1 className="mb-3 text-xl font-bold text-white">ویدئوها</h1>
      <p className="leading-8">
        بک‌اند فعلی endpoint یا مدل مستقلی برای مدیریت ویدئوها ندارد. تا وقتی این قابلیت در سرور اضافه نشده، این صفحه فقط پیام وضعیت را نشان می‌دهد و کاربر را گمراه نمی‌کند.
      </p>
      <a href="/admin/gallery" className="mt-4 inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-accent transition hover:bg-accent/15">
        مشاهده گالری تصاویر
      </a>
    </div>
  );
}
