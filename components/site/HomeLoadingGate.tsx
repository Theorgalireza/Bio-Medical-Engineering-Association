"use client";

import { useEffect, useState, type ReactNode } from "react";
import HomeSkeleton from "./HomeSkeleton";

export default function HomeLoadingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? children : <HomeSkeleton />;
}
