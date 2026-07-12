import { Announcement, Publication, FacultyMember, NavItem, Feedback } from "./types";

// ─── Types for Admin Panel ───────────────────────────────────────────────────

export type AdminAnnouncement = {
  id: string;
  title: string;
  date: string;
  category: "event" | "news" | "workshop";
  content: string;
  published: boolean;
};

export type Article = {
  id: string;
  title: string;
  authors: string[];
  issue: string;
  date: string;
  content: string;
  published: boolean;
};

export type AdminFacultyMember = {
  id: string;
  name: string;
  role: string;
  field: string;
  monogram: string;
  color: string;
};

export type AdminFeedback = {
  id: string;
  name: string;
  message: string;
  rating: number;
  date: string;
  approved: boolean;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};

// ─── Original Site Data (unchanged) ─────────────────────────────────────────

export const navItems: NavItem[] = [
  { label: "خانه", href: "#hero" },
  { label: "اعلامیه‌ها", href: "#announcements" },
  { label: "نشریات", href: "#publications" },
  { label: "هیئت علمی", href: "#faculty" },
  { label: "نظرسنجی", href: "#feedback" },
  { label: "ارتباط با انجمن", href: "#contact" },
];

export const announcements: Announcement[] = [
  { id: "an-01", title: "کارگاه پردازش سیگنال EEG با پایتون", date: "۱۴۰۳/۰۹/۱۸", type: "workshop", description: "آشنایی عملی با فیلترهای دیجیتال، استخراج ویژگی و طبقه‌بندی سیگنال‌های مغزی با استفاده از کتابخانه‌های MNE و NumPy.", isNew: true },
  { id: "an-02", title: "وبینار مقدمه‌ای بر رابط‌های مغز-رایانه (BCI)", date: "۱۴۰۳/۰۹/۲۵", type: "webinar", description: "بررسی معماری سامانه‌های BCI، از ثبت سیگنال تا فرمان‌دهی به دستگاه‌های خارجی، با حضور یکی از پژوهشگران آزمایشگاه نوروتک." },
  { id: "an-03", title: "مسابقه طراحی سخت‌افزار زیستی دانشجویی", date: "۱۴۰۳/۱۰/۰۵", type: "competition", description: "فراخوان تیم‌های دانشجویی برای طراحی و ساخت مدارهای ثبت سیگنال زیستی کم‌توان با محوریت ECG و EMG.", isNew: true },
  { id: "an-04", title: "فراخوان مقاله برای نشریه بیوالکتریک، شماره پاییز", date: "۱۴۰۳/۱۰/۱۵", type: "call_for_papers", description: "ارسال مقالات مروری و پژوهشی در حوزه‌های سیگنال‌های زیستی، نوروساینس محاسباتی و ابزار دقیق پزشکی تا پایان مهلت اعلام‌شده." },
  { id: "an-05", title: "بازدید علمی از آزمایشگاه نوروفیزیولوژی", date: "۱۴۰۳/۱۰/۲۲", type: "tour", description: "بازدید دانشجویان علاقه‌مند از تجهیزات ثبت EEG و EMG در آزمایشگاه نوروفیزیولوژی دانشکده مهندسی پزشکی." },
  { id: "an-06", title: "نشست هم‌اندیشی دانشجویان بیوالکتریک", date: "۱۴۰۳/۱۱/۰۲", type: "other", description: "گردهمایی ماهانه اعضای انجمن برای معرفی پروژه‌های شخصی، تبادل تجربه و برنامه‌ریزی فعالیت‌های ترم آینده." },
];

export const publications: Publication[] = [
  { id: "pub-01", title: "نشریه بیوالکتریک — سیگنال‌های عصبی و رابط‌های مغز-رایانه", issue: "شماره ۷", date: "پاییز ۱۴۰۳", description: "پرونده ویژه این شماره به رابط‌های مغز-رایانه و کاربردهای بالینی آن‌ها در توان‌بخشی اختصاص دارد.", pdfUrl: "#", accentColor: "accent" },
  { id: "pub-02", title: "بولتن آزمایشگاه — پایش سیگنال قلبی در پوشیدنی‌ها", issue: "شماره ۶", date: "تابستان ۱۴۰۳", description: "مروری بر مدارهای آنالوگ کم‌نویز برای ثبت ECG در دستگاه‌های پوشیدنی و چالش‌های حذف آرتیفکت حرکتی.", pdfUrl: "#", accentColor: "electric" },
  { id: "pub-03", title: "گزارش پژوهشی — پردازش تصویر در تشخیص کمکی بیماری‌های عصبی", issue: "شماره ۵", date: "بهار ۱۴۰۳", description: "گزارش کارگروه پردازش تصویر پزشکی درباره کاربرد یادگیری عمیق در تحلیل تصاویر fMRI.", pdfUrl: "#", accentColor: "neonPurple" },
  { id: "pub-04", title: "نشریه بیوالکتریک — مدارهای زیستی و ابزار دقیق", issue: "شماره ۴", date: "زمستان ۱۴۰۲", description: "مجموعه مقالات دانشجویی در زمینه طراحی تقویت‌کننده‌های ابزار دقیق برای سیگنال‌های زیستی ضعیف.", pdfUrl: "#", accentColor: "neonGreen" },
  { id: "pub-05", title: "بولتن آزمایشگاه — شبکه‌های عصبی و نوروساینس محاسباتی", issue: "شماره ۳", date: "پاییز ۱۴۰۲", description: "نگاهی به مدل‌های محاسباتی نورون و کاربرد آن‌ها در شبیه‌سازی شبکه‌های عصبی زیستی.", pdfUrl: "#", accentColor: "signal" },
  { id: "pub-06", title: "گزارش پژوهشی — الکترودهای خشک برای ثبت بلندمدت EEG", issue: "شماره ۲", date: "تابستان ۱۴۰۲", description: "بررسی مواد و ساختارهای نوین الکترود برای کاهش امپدانس تماس در ثبت‌های طولانی‌مدت.", pdfUrl: "#", accentColor: "accent" },
];

export const facultyMembers: FacultyMember[] = [
  { id: "fac-01", name: "دکتر سارا رضایی‌مقدم", title: "دانشیار مهندسی پزشکی", specialties: ["پردازش سیگنال EEG", "رابط مغز-رایانه", "یادگیری ماشین زیستی"], profileUrl: "#", scholarUrl: "#", signalTint: "accent" },
  { id: "fac-02", name: "دکتر امیرحسین طاهری", title: "استادیار مهندسی پزشکی", specialties: ["مدارهای آنالوگ زیستی", "ابزار دقیق پزشکی", "ECG/EMG"], profileUrl: "#", researchGateUrl: "#", signalTint: "electric" },
  { id: "fac-03", name: "دکتر مهسا کریمی", title: "استاد مهندسی پزشکی", specialties: ["نوروساینس محاسباتی", "مدل‌سازی شبکه عصبی", "fMRI"], profileUrl: "#", scholarUrl: "#", signalTint: "neonPurple" },
  { id: "fac-04", name: "دکتر رضا اصغرزاده", title: "دانشیار مهندسی پزشکی", specialties: ["پردازش تصویر پزشکی", "تشخیص کمکی به‌وسیله رایانه", "یادگیری عمیق"], profileUrl: "#", researchGateUrl: "#", signalTint: "neonGreen" },
  { id: "fac-05", name: "دکتر نگار حسینی", title: "استادیار مهندسی پزشکی", specialties: ["سیستم‌های نوروفیدبک", "الکترودهای زیستی", "توان‌بخشی دیجیتال"], profileUrl: "#", scholarUrl: "#", signalTint: "signal" },
  { id: "fac-06", name: "دکتر بابک نوروزی", title: "استاد مهندسی پزشکی", specialties: ["پردازش سیگنال‌های زیستی", "فیلترهای دیجیتال", "سامانه‌های پوشیدنی"], profileUrl: "#", researchGateUrl: "#", signalTint: "accent" },
];

export const seedFeedback: Feedback[] = [
  { id: "fb-01", name: "دانشجوی ترم ۵", rating: 5, message: "کارگاه پردازش سیگنال EEG واقعاً کاربردی بود، دوست دارم جلسات پیشرفته‌تری هم برگزار شود.", createdAt: "۱۴۰۳/۰۹/۲۰" },
  { id: "fb-02", rating: 4, message: "محتوای نشریه بیوالکتریک عالیه، فقط کاش دسترسی به نسخه چاپی هم فراهم بشه.", createdAt: "۱۴۰۳/۰۹/۱۴" },
];

// ─── Admin Mock Data ──────────────────────────────────────────────────────────

export const mockAnnouncements: AdminAnnouncement[] = [
  { id: "1", title: "کارگاه پردازش سیگنال EEG", date: "1403/09/15", category: "workshop", content: "آشنایی عملی با فیلترهای دیجیتال، استخراج ویژگی و طبقه‌بندی سیگنال‌های مغزی با استفاده از کتابخانه‌های MNE و NumPy.", published: true },
  { id: "2", title: "انتشار شماره جدید نشریه", date: "1403/09/01", category: "news", content: "شماره جدید نشریه بیوالکتریک منتشر شد.", published: true },
  { id: "3", title: "همایش مهندسی پزشکی", date: "1403/10/05", category: "event", content: "همایش سالانه مهندسی پزشکی برگزار می‌شود.", published: false },
];

export const mockArticles: Article[] = [
  { id: "1", title: "تحلیل سیگنال‌های EEG با ICA", authors: ["دکتر رضایی", "علی محمدی"], issue: "شماره ۱۲", date: "1403/08/01", content: "در این مقاله روش‌های تجزیه مستقل مؤلفه‌ها برای حذف آرتیفکت از سیگنال EEG بررسی می‌شود.", published: true },
  { id: "2", title: "فیلترهای Windowed Sinc در پردازش تصویر", authors: ["دکتر کریمی"], issue: "شماره ۱۲", date: "1403/08/15", content: "بررسی کاربرد فیلترهای Windowed Sinc با پنجره Blackman در پردازش تصاویر پزشکی.", published: true },
  { id: "3", title: "شبکه‌های عصبی در تشخیص آریتمی", authors: ["سارا احمدی", "رضا نوری"], issue: "شماره ۱۳", date: "1403/09/10", content: "استفاده از شبکه‌های عصبی کانولوشنی برای تشخیص خودکار آریتمی از سیگنال ECG.", published: false },
];

export const mockFaculty: AdminFacultyMember[] = [
  { id: "1", name: "دکتر محمد رضایی", role: "استاد", field: "پردازش سیگنال", monogram: "ر", color: "#00d4ff" },
  { id: "2", name: "دکتر سارا کریمی", role: "دانشیار", field: "تصویربرداری پزشکی", monogram: "ک", color: "#a855f7" },
  { id: "3", name: "دکتر علی نوری", role: "استادیار", field: "هوش مصنوعی پزشکی", monogram: "ن", color: "#22c55e" },
];

export const mockFeedback: AdminFeedback[] = [
  { id: "1", name: "امیر حسینی", message: "سایت بسیار مفید و کاربردی است.", rating: 5, date: "1403/09/20", approved: true },
  { id: "2", name: "نیلوفر صادقی", message: "محتوای علمی عالی بود.", rating: 4, date: "1403/09/18", approved: false },
];

export const mockContacts: Contact[] = [
  { id: "1", name: "رضا محمدی", email: "reza@example.com", subject: "همکاری پژوهشی", message: "درخواست همکاری در پروژه EEG دارم.", date: "1403/09/22", read: false },
  { id: "2", name: "مریم احمدی", email: "maryam@example.com", subject: "سوال درباره کارگاه", message: "آیا ثبت‌نام کارگاه هنوز باز است؟", date: "1403/09/21", read: true },
];
