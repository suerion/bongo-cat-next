"use client";

import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { I18nextProvider } from "react-i18next";
import i18n, { i18nReady } from "@/i18n";
import { I18nDebug } from "@/components/I18nDebug";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    void i18nReady.finally(() => setReady(true));
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
