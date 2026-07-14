"use client";

import type { ReactNode } from "react";
import ClientLayout from "../ClientLayout";

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}