"use client";

import React, { useEffect } from "react";
import { ConfigProvider } from "antd";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lng = i18n.resolvedLanguage ?? i18n.language;

    console.log("[i18n] language:", i18n.language);
    console.log("[i18n] resolvedLanguage:", i18n.resolvedLanguage);
    console.log("[i18n] languages:", i18n.languages);

    console.log("[i18n] has menu:", i18n.hasResourceBundle(lng, "menu"));
    console.log("[i18n] has system:", i18n.hasResourceBundle(lng, "system"));

    console.log("[i18n] t(scale.title @menu):", i18n.t("scale.title", { ns: "menu" }));
    console.log("[i18n] t(system:hideCat):", i18n.t("system:hideCat"));

    // Extra: harter Test auf en-US (um "en" vs "en-US" sofort zu entlarven)
    console.log("[i18n] has en-US/menu:", i18n.hasResourceBundle("en-US", "menu"));
    console.log("[i18n] t(scale.title @en-US):", i18n.t("scale.title", { ns: "menu", lng: "en-US" }));
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
        {children}
      </ConfigProvider>
    </I18nextProvider>
  );
}
