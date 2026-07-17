'use client';
import { useEffect, useState } from 'react';
import { getSiteSettings, bulkUpdateSiteSettings, SiteSetting } from '@/lib/api';

const SETTING_KEYS = [
  { key: 'site_name', label: 'نام سایت' },
  { key: 'site_description', label: 'توضیحات سایت' },
  { key: 'contact_email', label: 'ایمیل تماس' },
  { key: 'telegram_url', label: 'لینک تلگرام' },
  { key: 'instagram_url', label: 'لینک اینستاگرام' },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings().then((data) => {
      const map: Record<string, string> = {};
      data.forEach((s: SiteSetting) => { map[s.key] = s.value; });
      setValues(map);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await bulkUpdateSiteSettings(values);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <div className="text-white p-8">در حال بارگذاری...</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">تنظیمات سایت</h1>
      <form onSubmit={handleSave} className="space-y-4">
        {SETTING_KEYS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-1">{label}</label>
            <input
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              value={values[key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'در حال ذخیره...' : saved ? '✓ ذخیره شد' : 'ذخیره تنظیمات'}
        </button>
      </form>
    </div>
  );
}
