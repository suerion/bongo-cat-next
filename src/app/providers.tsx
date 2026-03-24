"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { I18nextProvider } from "react-i18next";
import i18n, { i18nReady } from "@/i18n";
import { Toaster } from "@/components/ui/sonner";

const I18nDebug = dynamic(
  () => import("@/components/I18nDebug").then((mod) => mod.I18nDebug),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    void i18nReady
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((e: unknown) => {
        console.error("[Providers] i18nReady failed:", e);
        if (mounted) setReady(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <Toaster />
      <I18nDebug />
    </I18nextProvider>
  );
}
