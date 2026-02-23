"use client";

import React from "react";
import i18n from "@/i18n";

export function I18nDebug() {
  const enabled = process.env.NEXT_PUBLIC_I18N_DEBUG === "1";
  if (!enabled) return null;

  const lng = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        left: 8,
        zIndex: 99999,
        padding: 10,
        border: "1px solid #ccc",
        background: "rgba(0,0,0,0.85)",
        color: "white",
        fontSize: 12,
        maxWidth: 520,
        whiteSpace: "pre-wrap",
      }}
    >
      {[
        `isInitialized: ${i18n.isInitialized}`,
        `language: ${i18n.language}`,
        `resolvedLanguage: ${i18n.resolvedLanguage}`,
        `languages array: ${i18n.languages.join(", ")}`,
        "",
        `has(${lng}, menu): ${i18n.hasResourceBundle(lng, "menu")}`,
        `has(${lng}, system): ${i18n.hasResourceBundle(lng, "system")}`,
        "",
        `has(en-US, menu): ${i18n.hasResourceBundle("en-US", "menu")}`,
        `has(de-DE, menu): ${i18n.hasResourceBundle("de-DE", "menu")}`,
        `has(zh-CN, menu): ${i18n.hasResourceBundle("zh-CN", "menu")}`,
        "",
        `t(menu scale.title): ${i18n.t("scale.title", { ns: "menu" })}`,
        `t(system:hideCat): ${i18n.t("system:hideCat")}`,
      ].join("\n")}
    </div>
  );
}
