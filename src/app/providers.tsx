"use client";

import { ConfigProvider } from "antd";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider
        theme={{
          token: { colorPrimary: "#1890ff" }
        }}
      >
        {children}
      </ConfigProvider>
    </I18nextProvider>
  );
}
