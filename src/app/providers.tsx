"use client";

import React from "react";
import dynamic from "next/dynamic";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { Toaster } from "@/components/ui/sonner";

const I18nDebug = dynamic(
  () => import("@/components/I18nDebug").then((mod) => mod.I18nDebug),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
      <Toaster />
      <I18nDebug />
    </I18nextProvider>
  );
}
