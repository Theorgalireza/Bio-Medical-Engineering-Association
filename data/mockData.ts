import {
  Announcement,
  Publication,
  FacultyMember,
  Article,
} from "@/types";export const announcements: Announcement[] = [
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
    title: "ویژه نامه شماره 1",
    issue: "شماره ۱",
    date: "پاییز 1404",
    category: "نشریه",
    summary: "اولین انتشار انجمن علمی مهندسی پزشکی با تمرکز بر آشنایی دانشجویان نو ورودی با فضای دانشگاه و رشه",
    authors: ["اعضای انجمن علمی مهندسی پزشکی"],
    year: 2024,
    description:
      "اولین انتشار انجمن علمی مهندسی پزشکی با تمرکز بر آشنایی دانشجویان نو ورودی با فضای دانشگاه و رشه",
    downloadUrl: "#",
  },
  {
    id: "2",
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
  {
    label: "ایمیل",
    value: "AlirezaJafary@gmail.com",
    icon: "mail",
  },
  {
    label: "تلفن",
    value: "+98 21 2243 1000",
    icon: "phone",
  },
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
export type Announcement = {
  id: string;
  title: string;
  date: string;
  category: "event" | "news" | "workshop";
  published: boolean;
};

export type Article = {
  id: string;
  title: string;
  authors: string[];
  issue: string;
  date: string;
  published: boolean;
};

export type FacultyMember = {
  id: string;
  name: string;
  role: string;
  field: string;
  monogram: string;
  color: string;
};

export type Feedback = {
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


export const mockFeedback: Feedback[] = [
  { id: "1", name: "امیر حسینی", message: "سایت بسیار مفید و کاربردی است.", rating: 5, date: "1403/09/20", approved: true },
  { id: "2", name: "نیلوفر صادقی", message: "محتوای علمی عالی بود.", rating: 4, date: "1403/09/18", approved: false },
];

export const mockContacts: Contact[] = [
  { id: "1", name: "رضا محمدی", email: "reza@example.com", subject: "همکاری پژوهشی", message: "درخواست همکاری در پروژه EEG دارم.", date: "1403/09/22", read: false },
  { id: "2", name: "مریم احمدی", email: "maryam@example.com", subject: "سوال درباره کارگاه", message: "آیا ثبت‌نام کارگاه هنوز باز است؟", date: "1403/09/21", read: true },
];
