import {
  Announcement,
  Publication,
  FacultyMember,
  Article,
  GalleryItem
} from "@/types";

// ================= SITE DATA (واقعی - بدون تغییر) =================

export const announcements: Announcement[] = [
  {
    id: "1",
    slug: "eeg-signal-workshop",
    title: "ورکشاپ پردازش سیگنال‌های EEG",
    date: "۱۴۰۳/۰۹/۱۵",
    type: "ورکشاپ",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    description:
      "آشنایی عملی با روش‌های پردازش سیگنال مغزی و استخراج ویژگی برای رابط‌های مغز-رایانه (BCI).",
    isNew: true,
  },
  {
    id: "2",
    slug: "bci-intro-webinar",
    title: "وبینار مقدمه‌ای بر رابط‌های مغز و رایانه",
    date: "۱۴۰۳/۰۹/۰۲",
    type: "وبینار",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    description:
      "بررسی مبانی BCI، کاربردهای بالینی و تحقیقاتی، و روندهای نوین این حوزه.",
    isNew: true,
  },
  {
    id: "3",
    slug: "medical-neuroscience-meeting",
    title: "نشست علمی مهندسی پزشکی و علوم اعصاب محاسباتی",
    date: "۱۴۰۳/۰۸/۲۰",
    type: "رویداد",
    description:
      "گردهمایی دانشجویان و اساتید برای بحث پیرامون آخرین یافته‌های علوم اعصاب محاسباتی.",
  },
  {
    id: "4",
    slug: "membership-call-1403",
    title: "فراخوان عضویت دوره جدید انجمن",
    date: "۱۴۰۳/۰۸/۱۰",
    type: "اطلاعیه",
    description:
      "ثبت‌نام اعضای جدید برای دوره فعالیتی ۱۴۰۳-۱۴۰۴ انجمن علمی بیوالکتریک آغاز شد.",
  },
  {
    id: "5",
    slug: "bioanalog-circuits-workshop",
    title: "کارگاه آموزشی مدارات آنالوگ زیستی",
    date: "۱۴۰۳/۰۷/۲۸",
    type: "ورکشاپ",
    description:
      "طراحی و شبیه‌سازی مدارات تقویت‌کننده سیگنال‌های زیستی (ECG/EMG/EEG).",
  },
  {
    id: "6",
    slug: "neurotech-career-webinar",
    title: "وبینار مسیر شغلی در حوزه نوروتک",
    date: "۱۴۰۳/۰۷/۱۵",
    type: "وبینار",
    description:
      "گفتگو با فارغ‌التحصیلان فعال در صنعت و پژوهش حوزه بیوالکتریک و نوروتکنولوژی.",
  },
];

export const publications: Publication[] = [
  {
    id: "1",
    slug: "special-issue-1",   // ← slug انگلیسی و kebab-case
    title: "ویژه نامه شماره 1",
    issue: "شماره ۱",
    date: "پاییز 1404",
    category: "نشریه",
    summary:
      "اولین انتشار انجمن علمی مهندسی پزشکی با تمرکز بر آشنایی دانشجویان نو ورودی با فضای دانشگاه و رشه",
    authors: ["اعضای انجمن علمی مهندسی پزشکی"],
    year: 2024,
    description:
      "اولین انتشار انجمن علمی مهندسی پزشکی با تمرکز بر آشنایی دانشجویان نو ورودی با فضای دانشگاه و رشه",
    downloadUrl: "#",
  },
  {
    id: "2",
    slug: "bci-special-report",
    title: "گزارش ویژه: رابط‌های مغز و رایانه",
    issue: "شماره ۲",
    date: "زمستان ۱۴۰۳",
    category: "BCI",
    summary: "بررسی تخصصی فناوری‌های BCI و کاربردهای بالینی",
    authors: ["دکتر ابوالفضل ولیزاده"],
    year: 2024,
    description:
      "بررسی تخصصی فناوری‌های BCI، از پژوهش‌های آزمایشگاهی تا کاربردهای بالینی نوین.",
    downloadUrl: "#",
  },
  {
    id: "3",
    slug: "computational-neuroscience-collection",
    title: "مجموعه مقالات علوم اعصاب محاسباتی",
    issue: "شماره ۳",
    date: "بهار ۱۴۰۴",
    category: "Deep Learning",
    summary: "گردآوری مقالات دانشجویی در حوزه مدل‌سازی محاسباتی",
    authors: ["دکتر راحله داوودی"],
    year: 2025,
    description:
      "گردآوری مقالات دانشجویی در حوزه مدل‌سازی محاسباتی فعالیت‌های عصبی.",
    downloadUrl: "#",
  },
];


export const facultyMembers: FacultyMember[] = [
  {
    id: "1",
    name: "دکتر ابوالفضل ولیزاده",
    title: "استادیار مهندسی پزشکی",
    specialties: ["بیوالکتریک", "EEG/ECG", "پردازش سیگنال"],
  },
  {
    id: "2",
    name: "دکتر راحله داوودی",
    title: "استادیار مهندسی پزشکی",
    specialties: ["BCI", "شبکه‌های عصبی", "علوم اعصاب"],
  },
  {
    id: "3",
    name: "دکتر صدیقه دهقانی",
    title: "استادیار مهندسی پزشکی",
    specialties: ["مدارات زیستی", "بیوالکتریک", "ابزار دقیق پزشکی"],
  },
  {
    id: "4",
    name: "دکتر رضا لشکری",
    title: "استادیار مهندسی پزشکی",
    specialties: ["BCI", "رباتیک", "کنترل عصبی"],
  },
];

export const contactInfo = [
  { label: "ایمیل", value: "AlirezaJafary@gmail.com", icon: "mail" },
  { label: "تلفن", value: "+98 21 2243 1000", icon: "phone" },
  {
    label: "آدرس",
    value: "تهران، اوین، دانشگاه شهید بهشتی، دانشکده مهندسی پزشکی",
    icon: "pin",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "brain-computer-interface",
    title: "رابط مغز و رایانه؛ آینده تعامل انسان و ماشین",
    summary:
      "در این مقاله با ساختار سیستم‌های BCI، کاربردهای پزشکی، صنعتی و آینده این فناوری آشنا می‌شویم.",
    category: "BCI",
    authors: ["دکتر علی محمدی"],
    year: 2025,
    readingTime: 8,
    featured: true,
  },
  {
    id: "2",
    slug: "eeg-signal-processing",
    title: "پردازش سیگنال EEG با روش‌های یادگیری ماشین",
    summary:
      "بررسی روش‌های استخراج ویژگی، حذف نویز و دسته‌بندی سیگنال‌های مغزی با الگوریتم‌های هوش مصنوعی.",
    category: "EEG",
    authors: ["دکتر سارا احمدی"],
    year: 2025,
    readingTime: 12,
  },
  {
    id: "3",
    slug: "ecg-analysis",
    title: "تحلیل سیگنال ECG برای تشخیص بیماری‌های قلبی",
    summary:
      "مروری بر روش‌های نوین تحلیل سیگنال‌های قلبی و کاربرد شبکه‌های عصبی در تشخیص بیماری.",
    category: "ECG",
    authors: ["دکتر رضا کریمی"],
    year: 2024,
    readingTime: 10,
  },
  {
    id: "4",
    slug: "deep-learning-biomedical",
    title: "کاربرد Deep Learning در مهندسی پزشکی",
    summary:
      "بررسی کاربرد شبکه‌های عصبی عمیق در تحلیل تصاویر پزشکی، سیگنال‌های زیستی و سامانه‌های تشخیص.",
    category: "Deep Learning",
    authors: ["دکتر مریم حسینی"],
    year: 2025,
    readingTime: 14,
  },
  {
    id: "5",
    slug: "biosensors",
    title: "نسل جدید حسگرهای زیستی",
    summary:
      "آشنایی با Biosensorهای نسل جدید و نقش آن‌ها در تشخیص سریع بیماری‌ها.",
    category: "BioSensors",
    authors: ["دکتر علی محمدی"],
    year: 2024,
    readingTime: 9,
  },
  {
    id: "6",
    slug: "medical-ai",
    title: "هوش مصنوعی در پزشکی",
    summary:
      "کاربرد مدل‌های هوشمند در تشخیص، درمان و مدیریت داده‌های پزشکی.",
    category: "AI",
    authors: ["دکتر سارا احمدی"],
    year: 2025,
    readingTime: 11,
  },
];
// داده‌های نمونه برای گالری
export const galleryItems: GalleryItem[] = [
  {
    id: "gal1",
    title: "کارگاه پردازش سیگنال EEG",
    description:
      "جلسه عملی پردازش سیگنال‌های مغزی با استفاده از نرم‌افزارهای تخصصی.",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    date: "۱۴۰۳/۰۹/۱۵",
    category: "ورکشاپ",
  },
  {
    id: "gal2",
    title: "وبینار مقدمه‌ای بر BCI",
    description:
      "بررسی کاربردها و آخرین تحقیقات در زمینه رابط‌های مغز و رایانه.",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    date: "۱۴۰۳/۰۹/۰۲",
    category: "وبینار",
  },
  {
    id: "gal3",
    title: "نشست علمی علوم اعصاب",
    description:
      "گردهمایی اساتید و دانشجویان برای بحث در مورد پیشرفت‌های علوم اعصاب.",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-3726766de014?auto=format&fit=crop&w=1200&q=80",
    date: "۱۴۰۳/۰۸/۲۰",
    category: "رویداد",
  },
  {
    id: "gal4",
    title: "اولین فراخوان عضویت",
    description:
      "آغاز ثبت‌نام اعضای جدید برای دوره ۱۴۰۳-۱۴۰۴ انجمن.",
    imageUrl:
      "https://images.unsplash.com/photo-1579779855271-e9887103889e?auto=format&fit=crop&w=1200&q=80",
    date: "۱۴۰۳/۰۸/۱۰",
    category: "اطلاعیه",
  },
  {
    id: "gal5",
    title: "کارگاه مدارهای زیستی",
    description:
      "طراحی و شبیه‌سازی مدارات آنالوگ برای سیگنال‌های زیستی.",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", // تکراری برای مثال
    date: "۱۴۰۳/۰۷/۲۸",
    category: "ورکشاپ",
  },
  {
    id: "gal6",
    title: "مسیر شغلی در نوروتک",
    description:
      "گفتگو با متخصصان صنعت نوروتکنولوژی.",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80", // تکراری برای مثال
    date: "۱۴۰۳/۰۷/۱۵",
    category: "وبینار",
  },
];

// ================= ADMIN TYPES =================

export type AdminAnnouncement = {
  id: string;
  title: string;
  date: string;
  category: "event" | "news" | "workshop";
  content: string;
  published: boolean;
};

export type AdminArticle = {
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

// ================= ADMIN HELPERS =================

function mapAnnouncementType(
  type: Announcement["type"]
): AdminAnnouncement["category"] {
  switch (type) {
    case "ورکشاپ":
      return "workshop";
    case "اطلاعیه":
      return "news";
    default:
      return "event"; // وبینار، رویداد
  }
}

function getMonogram(name: string): string {
  const clean = name.replace("دکتر", "").trim();
  return clean.charAt(0);
}

const facultyColorPalette = [
  "#00d4ff",
  "#7c3aed",
  "#f59e0b",
  "#10b981",
  "#ef4444",
];

// ================= ADMIN DATA (مشتق‌شده از داده‌های واقعی) =================

export const mockAnnouncements: AdminAnnouncement[] = announcements.map(
  (a) => ({
    id: a.id,
    title: a.title,
    date: a.date,
    category: mapAnnouncementType(a.type),
    content: a.description,
    published: true,
  })
);
export const mockArticles: AdminArticle[] = publications.map((p) => ({
  id: p.id,
  title: p.title,
  authors: p.authors ?? [],
  issue: p.issue,
  date: p.date,
  // اگر 'content' در 'p' وجود ندارد، از یک رشته خالی یا یک متن پیش‌فرض استفاده می‌کنیم
  content: (p as any).content || "محتوایی برای این مقاله ثبت نشده است.", 
  published: true,
}));


export const mockFaculty: AdminFacultyMember[] = facultyMembers.map(
  (f, index) => ({
    id: f.id,
    name: f.name,
    role: f.title,
    field: f.specialties.join("، "),
    monogram: getMonogram(f.name),
    color: facultyColorPalette[index % facultyColorPalette.length],
  })
);

// این دو مورد منبع واقعی در سایت ندارند و فعلاً ثابت باقی می‌مانند
export const mockFeedback: AdminFeedback[] = [
  {
    id: "1",
    name: "امیر حسینی",
    message: "سایت عالی بود",
    rating: 5,
    date: "1403/09/20",
    approved: true,
  },
];

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "رضا محمدی",
    email: "reza@example.com",
    subject: "همکاری",
    message: "درخواست همکاری",
    date: "1403/09/22",
    read: false,
  },
];
// در "@/data/mockData.ts"

// نوع اعضای انجمن
export type AdminMember = {
  id: number;
  name: string;
  studentId: string;
  major: string;
  entryYear: number;
  role: string;      // عضو عادی، عضو فعال، هیئت مدیره، ...
  email: string;
  phone?: string;
  status: "active" | "inactive";
};

// داده‌های نمونه
export const mockMembers: AdminMember[] = [
  {
    id: 1,
    name: "علیرضا احمدی",
    studentId: "401234567",
    major: "مهندسی پزشکی",
    entryYear: 1401,
    role: "عضو فعال",
    email: "alireza@example.com",
    phone: "09120000000",
    status: "active",
  },
  {
    id: 2,
    name: "سارا محمدی",
    studentId: "391112233",
    major: "مهندسی پزشکی",
    entryYear: 1399,
    role: "عضو عادی",
    email: "sara@example.com",
    status: "inactive",
  },
];
