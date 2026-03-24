"use client";

import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { I18nextProvider } from "react-i18next";
import i18n, { i18nReady } from "@/i18n";
import { I18nDebug } from "@/components/I18nDebug";

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
      <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
        {children}
        <I18nDebug />
      </ConfigProvider>
    </I18nextProvider>
  );
}
