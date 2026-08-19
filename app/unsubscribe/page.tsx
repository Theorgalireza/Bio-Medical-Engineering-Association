"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicUnsubscribe } from "@/lib/api";
import Spinner from "@/components/ui/Spinner";

export default function UnsubscribePage() {
  const [state, setState] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setState("error");
      return;
    }

    publicUnsubscribe(token)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-4 text-center">
      <div className="rounded-2xl border border-borderSoft bg-primaryLight p-8 text-white">
        {state === "loading" && <><Spinner size={32} /><p className="mt-4">در حال لغو اشتراک...</p></>}
        {state === "success" && <><h1 className="text-xl font-bold text-neonGreen">اشتراک شما لغو شد</h1><p className="mt-3 text-gray-400">دیگر ایمیل‌های خبرنامه برای شما ارسال نمی‌شود.</p></>}
        {state === "error" && <><h1 className="text-xl font-bold text-red-400">لینک نامعتبر است</h1><p className="mt-3 text-gray-400">امکان لغو اشتراک وجود ندارد.</p></>}
        <Link href="/" className="mt-6 inline-block text-accent hover:underline">بازگشت به صفحه اصلی</Link>
      </div>
    </main>
  );
}
