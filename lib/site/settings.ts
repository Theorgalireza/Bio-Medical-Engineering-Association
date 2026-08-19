import { unstable_cache } from "next/cache";
import { getSiteSettings, type SiteSetting } from "@/lib/api";

export interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  telegram_url: string;
  instagram_url: string;
}

export const defaultSiteSettings: SiteSettings = {
  site_name: "انجمن مهندسی پزشکی",
  site_description:
    "انجمن علمی مهندسی پزشکی، گرایش بیوالکتریک، دانشگاه شهید بهشتی.",
  contact_email: "AlirezaJafary@gmail.com",
  contact_phone: "",
  contact_address: "دانشگاه شهید بهشتی، دانشکده مهندسی پزشکی، تهران",
  telegram_url: "",
  instagram_url: "",
};

function mapSettings(rows: SiteSetting[]): SiteSettings {
  const map = new Map(rows.map((row) => [row.key, row.value]));
  return {
    site_name: map.get("site_name") || defaultSiteSettings.site_name,
    site_description:
      map.get("site_description") || defaultSiteSettings.site_description,
    contact_email: map.get("contact_email") || defaultSiteSettings.contact_email,
    contact_phone: map.get("contact_phone") || defaultSiteSettings.contact_phone,
    contact_address: map.get("contact_address") || defaultSiteSettings.contact_address,
    telegram_url: map.get("telegram_url") || defaultSiteSettings.telegram_url,
    instagram_url: map.get("instagram_url") || defaultSiteSettings.instagram_url,
  };
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await getSiteSettings();
    return mapSettings(rows);
  } catch {
    return defaultSiteSettings;
  }
}

export const getCachedSiteSettings = unstable_cache(
  fetchSiteSettings,
  ["site-settings"],
  { revalidate: 300, tags: ["site-settings"] },
);
