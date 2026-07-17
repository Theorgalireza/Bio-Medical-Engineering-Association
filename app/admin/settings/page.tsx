'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { RefreshCw, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSiteSettings, bulkUpdateSiteSettings, type SiteSetting } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const SETTING_KEYS = [
  { key: 'site_name', label: 'نام سایت' },
  { key: 'site_description', label: 'توضیحات سایت' },
  { key: 'contact_email', label: 'ایمیل تماس' },
  { key: 'contact_phone', label: 'شماره تماس' },
  { key: 'contact_address', label: 'آدرس' },
  { key: 'telegram_url', label: 'لینک تلگرام' },
  { key: 'instagram_url', label: 'لینک اینستاگرام' },
] as const;

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const canManage = user?.role === 'OWNER' || user?.role === 'ADMIN';
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      const map: Record<string, string> = {};
      data.forEach((s: SiteSetting) => {
        map[s.key] = s.value;
      });
      setValues(map);
    } catch (error) {
      setFeedback({
        type: 'err',
        text: error instanceof Error ? error.message : 'دریافت تنظیمات با خطا مواجه شد.',
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
  }, [authLoading, canManage]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await bulkUpdateSiteSettings(values);
      await fetch('/api/revalidate-settings', { method: 'POST' }).catch(() => {});
      setFeedback({ type: 'ok', text: 'تنظیمات با موفقیت ذخیره شد.' });
    } catch (error) {
      setFeedback({
        type: 'err',
        text: error instanceof Error ? error.message : 'ذخیره تنظیمات با خطا مواجه شد.',
      });
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/50">در حال بارگذاری...</div>;
  }

  if (!canManage) {
    return (
      <div dir="rtl" className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        این بخش فقط برای مدیران سیستم در دسترس است.
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">تنظیمات سایت</h1>
          <p className="mt-1 text-sm text-white/50">این مقادیر از جدول SiteSetting در بک‌اند خوانده و نوشته می‌شوند.</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
        >
          <RefreshCw size={15} />
          بازخوانی
        </button>
      </div>

      {feedback && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${
          feedback.type === 'ok'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-red-500/30 bg-red-500/10 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.text}
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-white/10 bg-[#0d1526] p-5">
        {SETTING_KEYS.map(({ key, label }) => (
          <div key={key}>
            <label className="mb-1 block text-sm text-white/60">{label}</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-accent"
              value={values[key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          </div>
        ))}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium text-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </button>
        </div>
      </form>
    </div>
  );
}
