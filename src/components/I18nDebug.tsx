"use client";

import React from "react";
import i18n from "@/i18n";

export function I18nDebug() {
  const enabled = process.env.NEXT_PUBLIC_I18N_DEBUG === "1";
  if (!enabled) return null;

  const lng = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div style={{
      position: "fixed",
      bottom: 8,
      left: 8,
      zIndex: 99999,
      padding: 10,
      border: "1px solid #ccc",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      fontSize: 12,
      maxWidth: 420,
      whiteSpace: "pre-wrap",
    }}>
      {[
        `language: ${i18n.language}`,
        `resolved: ${i18n.resolvedLanguage}`,
        `lng used: ${lng}`,
        `has(${lng}, menu): ${i18n.hasResourceBundle(lng, "menu")}`,
        `has(${lng}, system): ${i18n.hasResourceBundle(lng, "system")}`,
        `t(menu scale.title): ${i18n.t("scale.title", { ns: "menu" })}`,
        `t(system:hideCat): ${i18n.t("system:hideCat")}`,
      ].join("\n")}
    </div>
  );
}
