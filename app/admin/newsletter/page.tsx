'use client';
import { useEffect, useState } from 'react';
import { Trash2, Send, Users, Mail } from 'lucide-react';
import {
  adminGetSubscribers,
  adminDeleteSubscriber,
  adminGetCampaigns,
  adminSendCampaign,
} from '@/lib/api';
import RichEditor from '@/components/admin/RichEditor';
import NeonButton from '@/components/ui/NeonButton';
import Spinner from '@/components/ui/Spinner';

type Subscriber = { id: string; email: string; name?: string; createdAt: string; isActive: boolean };
type Campaign = { id: string; subject: string; sentAt: string; recipientCount: number };

type Tab = 'subscribers' | 'send' | 'history';

export default function NewsletterPage() {
  const [tab, setTab] = useState<Tab>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  const [subs, camps] = await Promise.all([adminGetSubscribers(), adminGetCampaigns()]);
setSubscribers(subs as Subscriber[]);
setCampaigns(camps as Campaign[]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [subs, camps] = await Promise.all([adminGetSubscribers(), adminGetCampaigns()]);
      setSubscribers(subs);
      setCampaigns(camps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await adminDeleteSubscriber(id);
    setSubscribers((p) => p.filter((s) => s.id !== id));
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setMsg({ type: 'err', text: 'موضوع و متن خبرنامه الزامی است.' });
      return;
    }
    setSending(true);
    setMsg(null);
    try {
const res = await adminSendCampaign({ subject, body }) as { recipientCount: number };
      setMsg({ type: 'ok', text: `خبرنامه با موفقیت به ${res.recipientCount} نفر ارسال شد.` });
      setSubject('');
      setBody('');
      await load();
      setTab('history');
    } catch {
      setMsg({ type: 'err', text: 'ارسال خبرنامه با خطا مواجه شد.' });
    } finally {
      setSending(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'subscribers', label: `مشترکین (${subscribers.length})`, icon: <Users size={15} /> },
    { key: 'send', label: 'ارسال خبرنامه', icon: <Send size={15} /> },
    { key: 'history', label: 'تاریخچه', icon: <Mail size={15} /> },
  ];

  return (
    <div dir="rtl" className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-accent mb-6">مدیریت خبرنامه</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-accent/20 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-accent/20 text-accent border border-accent/30 border-b-0'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={36} /></div>
      ) : (
        <>
          {/* Subscribers Tab */}
          {tab === 'subscribers' && (
            <div className="bg-surface/60 border border-accent/20 rounded-2xl overflow-hidden">
              {subscribers.length === 0 ? (
                <p className="text-white/40 text-center py-12">هیچ مشترکی وجود ندارد.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-accent/10 text-white/60">
                    <tr>
                      <th className="text-right px-4 py-3">ایمیل</th>
                      <th className="text-right px-4 py-3">نام</th>
                      <th className="text-right px-4 py-3">تاریخ عضویت</th>
                      <th className="text-right px-4 py-3">وضعیت</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-t border-accent/10 hover:bg-accent/5">
                        <td className="px-4 py-3 text-white">{s.email}</td>
                        <td className="px-4 py-3 text-white/70">{s.name || '—'}</td>
                        <td className="px-4 py-3 text-white/50">
                          {new Date(s.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            s.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {s.isActive ? 'فعال' : 'لغو شده'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Send Tab */}
          {tab === 'send' && (
            <div className="space-y-4">
              <div className="bg-surface/60 border border-accent/20 rounded-2xl p-6 space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-1 block">موضوع ایمیل</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="موضوع خبرنامه..."
                    className="w-full rounded-xl bg-primary/60 border border-accent/20 px-4 py-2.5 text-sm text-white outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-1 block">متن خبرنامه</label>
                  <RichEditor
                    value={body}
                    onChange={setBody}
                    placeholder="محتوای خبرنامه را وارد کنید..."
                    minHeight="280px"
                  />
                </div>
              </div>

              {msg && (
                <div className={`text-sm px-4 py-3 rounded-xl border ${
                  msg.type === 'ok'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {msg.text}
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-white/40">
                  ارسال به {subscribers.filter((s) => s.isActive).length} مشترک فعال
                </p>
                <NeonButton onClick={handleSend} disabled={sending} variant="primary">
                  {sending ? <Spinner size={18} /> : <><Send size={15} /> ارسال خبرنامه</>}
                </NeonButton>
              </div>
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div className="bg-surface/60 border border-accent/20 rounded-2xl overflow-hidden">
              {campaigns.length === 0 ? (
                <p className="text-white/40 text-center py-12">هنوز خبرنامه‌ای ارسال نشده.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-accent/10 text-white/60">
                    <tr>
                      <th className="text-right px-4 py-3">موضوع</th>
                      <th className="text-right px-4 py-3">تاریخ ارسال</th>
                      <th className="text-right px-4 py-3">تعداد دریافت‌کنندگان</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className="border-t border-accent/10 hover:bg-accent/5">
                        <td className="px-4 py-3 text-white">{c.subject}</td>
                        <td className="px-4 py-3 text-white/50">
                          {c.sentAt ? new Date(c.sentAt).toLocaleDateString('fa-IR') : '—'}
                        </td>
                        <td className="px-4 py-3 text-accent font-medium">{c.recipientCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
