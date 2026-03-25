"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

const I18nDebug = dynamic(
  () => import("@/components/I18nDebug").then((mod) => mod.I18nDebug),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
      <I18nDebug />
    </>
  );
}
