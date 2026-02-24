"use client";

import React from "react";
import i18n from "@/i18n";

export function I18nDebug() {
  if (process.env.NEXT_PUBLIC_I18N_DEBUG !== "1") return null;

  const lng = i18n.resolvedLanguage ?? i18n.language;

  const menu = i18n.getResourceBundle(lng, "menu");
  const system = i18n.getResourceBundle(lng, "system");

  const menuTop = menu ? Object.keys(menu).slice(0, 20) : [];
  const systemTop = system ? Object.keys(system).slice(0, 20) : [];

  return (
    <div style={{
      position: "fixed",
      bottom: 8,
      left: 8,
      zIndex: 99999,
      padding: 10,
      border: "1px solid #ccc",
      background: "rgba(0,0,0,0.85)",
      color: "white",
      fontSize: 12,
      maxWidth: 760,
      whiteSpace: "pre-wrap",
    }}>
      {[
        `language: ${i18n.language}`,
        `resolvedLanguage: ${i18n.resolvedLanguage}`,
        `lng used: ${lng}`,
        "",
        `has(${lng}, menu): ${i18n.hasResourceBundle(lng, "menu")}`,
        `has(${lng}, system): ${i18n.hasResourceBundle(lng, "system")}`,
        "",
        `menu keys (top): ${JSON.stringify(menuTop)}`,
        `system keys (top): ${JSON.stringify(systemTop)}`,
        "",
        `menu.scale?: ${String(!!menu?.scale)}`,
        `menu.scale.title (nested): ${String(menu?.scale?.title)}`,
        `menu["scale.title"] (flat): ${String(menu?.["scale.title"])}`,
        "",
        `system.hideCat (direct): ${String(system?.hideCat)}`,
        `system.system?.hideCat (wrapper): ${String(system?.system?.hideCat)}`,
        "",
        `t(menu scale.title): ${i18n.t("scale.title", { ns: "menu" })}`,
        `t(system:hideCat): ${i18n.t("system:hideCat")}`,
      ].join("\n")}
    </div>
  );
}
