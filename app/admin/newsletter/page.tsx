"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Trash2, Send, Users, Mail, RefreshCw, Search } from "lucide-react";
import {
  adminGetSubscribers,
  adminDeleteSubscriber,
  adminGetCampaigns,
  adminSendCampaign,
} from "@/lib/api";
import type {
  NewsletterSubscriber,
  NewsletterCampaign,
} from "@/types";
import RichEditor from "@/components/admin/RichEditor";
import NeonButton from "@/components/ui/NeonButton";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

type Tab = "subscribers" | "send" | "history";
type Message = { type: "ok" | "err"; text: string } | null;

const tabs: { key: Tab; label: string; icon: ReactNode }[] = [
  { key: "subscribers", label: "مشترکین", icon: <Users size={15} /> },
  { key: "send", label: "ارسال خبرنامه", icon: <Send size={15} /> },
  { key: "history", label: "تاریخچه", icon: <Mail size={15} /> },
];

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(value));
}

export default function NewsletterPage() {
  const { user, loading: authLoading } = useAuth();
  const canManage = user?.role === "OWNER" || user?.role === "ADMIN";
  const [tab, setTab] = useState<Tab>("subscribers");
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<Message>(null);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, camps] = await Promise.all([
        adminGetSubscribers(showAll),
        adminGetCampaigns(),
      ]);
      setSubscribers(subs);
      setCampaigns(camps);
    } catch (error) {
      setMsg({
        type: "err",
        text: error instanceof Error ? error.message : "بارگذاری خبرنامه با خطا مواجه شد.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!canManage) {
      setLoading(false);
      return;
    }

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, canManage, showAll]);

  const filteredSubscribers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return subscribers;
    return subscribers.filter((subscriber) =>
      [subscriber.email, subscriber.name ?? "", subscriber.token]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [query, subscribers]);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این مشترک مطمئن هستید؟")) return;
    try {
      await adminDeleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      setMsg({
        type: "err",
        text: error instanceof Error ? error.message : "حذف مشترک با خطا مواجه شد.",
      });
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setMsg({ type: "err", text: "موضوع و متن خبرنامه الزامی است." });
      return;
    }
    setSending(true);
    setMsg(null);
    try {
      const res = await adminSendCampaign({ subject, body });
      setMsg({
        type: "ok",
        text: `خبرنامه با موفقیت به ${res.recipientCount} نفر ارسال شد.`,
      });
      setSubject("");
      setBody("");
      await load();
      setTab("history");
    } catch (error) {
      setMsg({
        type: "err",
        text: error instanceof Error ? error.message : "ارسال خبرنامه با خطا مواجه شد.",
      });
    } finally {
      setSending(false);
    }
  };

  const activeCount = subscribers.filter((subscriber) => subscriber.isActive).length;

  if (authLoading) {
    return <div className="flex justify-center py-20"><Spinner size={40} /></div>;
  }

  if (!canManage) {
    return (
      <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        این بخش فقط برای مدیران سیستم در دسترس است.
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-accent">مدیریت خبرنامه</h1>
          <p className="mt-1 text-sm text-white/50">
            مشترکان، لغو اشتراک و ارسال کمپین‌ها از اینجا مدیریت می‌شود.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-accent transition hover:bg-accent/15"
        >
          <RefreshCw size={15} />
          تازه‌سازی
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-accent/20 pb-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`inline-flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === item.key
                ? "border border-accent/30 border-b-0 bg-accent/20 text-accent"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={40} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">کل مشترکین</p>
              <p className="mt-2 text-2xl font-bold text-white">{subscribers.length.toLocaleString("fa-IR")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">مشترکین فعال</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">{activeCount.toLocaleString("fa-IR")}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/50">کمپین‌های ارسال شده</p>
              <p className="mt-2 text-2xl font-bold text-cyan-300">{campaigns.length.toLocaleString("fa-IR")}</p>
            </div>
          </div>

          {msg && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                msg.type === "ok"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {msg.text}
            </div>
          )}

          {tab === "subscribers" && (
            <div className="space-y-4 rounded-2xl border border-accent/20 bg-surface/60 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={showAll}
                    onChange={(e) => setShowAll(e.target.checked)}
                    className="accent-accent"
                  />
                  همه مشترکین را نشان بده
                </label>

                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                  <Search size={15} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="جستجو در ایمیل، نام یا توکن..."
                    className="w-full bg-transparent outline-none placeholder:text-white/30"
                  />
                </label>
              </div>

              {filteredSubscribers.length === 0 ? (
                <p className="py-12 text-center text-white/40">هیچ مشترکی پیدا نشد.</p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-white/60">
                      <tr>
                        <th className="px-4 py-3 text-right">ایمیل</th>
                        <th className="px-4 py-3 text-right">نام</th>
                        <th className="px-4 py-3 text-right">وضعیت</th>
                        <th className="px-4 py-3 text-right">تاریخ عضویت</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-white">{subscriber.email}</td>
                          <td className="px-4 py-3 text-white/70">{subscriber.name || "—"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                subscriber.isActive
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {subscriber.isActive ? "فعال" : "لغو شده"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/50">{formatDate(subscriber.createdAt)}</td>
                          <td className="px-4 py-3 text-left">
                            <button
                              onClick={() => handleDelete(subscriber.id)}
                              className="text-red-400 transition hover:text-red-300"
                              aria-label="حذف مشترک"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "send" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-accent/20 bg-surface/60 p-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-white/70">موضوع ایمیل</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="موضوع خبرنامه..."
                    className="w-full rounded-xl border border-accent/20 bg-primary/60 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-white/70">متن خبرنامه</label>
                  <RichEditor
                    value={body}
                    onChange={setBody}
                    placeholder="محتوای خبرنامه را وارد کنید..."
                    minHeight="280px"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/40">
                  ارسال به {activeCount.toLocaleString("fa-IR")} مشترک فعال
                </p>
                <NeonButton onClick={handleSend} disabled={sending} variant="primary">
                  {sending ? <Spinner size={18} /> : <><Send size={15} /> ارسال خبرنامه</>}
                </NeonButton>
              </div>
            </div>
          )}

          {tab === "history" && (
            <div className="space-y-3 rounded-2xl border border-accent/20 bg-surface/60 p-4">
              {campaigns.length === 0 ? (
                <p className="py-12 text-center text-white/40">هنوز خبرنامه‌ای ارسال نشده است.</p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-white/60">
                      <tr>
                        <th className="px-4 py-3 text-right">موضوع</th>
                        <th className="px-4 py-3 text-right">تاریخ ارسال</th>
                        <th className="px-4 py-3 text-right">تعداد دریافت‌کنندگان</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-white">{campaign.subject}</td>
                          <td className="px-4 py-3 text-white/50">{formatDate(campaign.sentAt)}</td>
                          <td className="px-4 py-3 text-cyan-300">
                            {campaign.recipientCount.toLocaleString("fa-IR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
