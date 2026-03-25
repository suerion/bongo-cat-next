"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import appI18n from "@/i18n";

function getTranslatorInfo(i18nInstance: unknown) {
  const i = i18nInstance as { services?: unknown };

  const services = i.services;
  if (!services || typeof services !== "object") {
    return { trLng: "n/a", trKeySep: "n/a", trNsSep: "n/a" };
  }

  const s = services as unknown as { translator?: unknown };
  const translator = s.translator;
  if (!translator || typeof translator !== "object") {
    return { trLng: "n/a", trKeySep: "n/a", trNsSep: "n/a" };
  }

  const t = translator as { language?: unknown; options?: unknown };

  const options = t.options;
  const o = options && typeof options === "object" ? (options as Record<string, unknown>) : {};

  return {
    trLng: String(t.language),
    trKeySep: String(o["keySeparator"]),
    trNsSep: String(o["nsSeparator"]),
  };
}

function getInternalDebug(i18nInstance: unknown) {
  const rec = i18nInstance as Record<string, unknown>;
  const trReady = rec["__translatorReady"];
  const svcList = rec["__servicesList"];
  const initErr = rec["__initError"];

  return {
    trReady: typeof trReady === "boolean" ? trReady : undefined,
    svcList: Array.isArray(svcList) ? svcList.map(String) : undefined,
    initErr: typeof initErr === "string" ? initErr : undefined,
  };
}

export function I18nDebug() {
  const { i18n: contextI18n } = useTranslation();
	
  if (process.env.NEXT_PUBLIC_I18N_DEBUG !== "1") return null;

  const i18n = contextI18n;

  const lng: string = i18n.resolvedLanguage ?? i18n.language;

  const menu = i18n.getResourceBundle(lng, "menu") as Record<string, unknown> | undefined;
  const system = i18n.getResourceBundle(lng, "system") as Record<string, unknown> | undefined;

  const menuTop = menu ? Object.keys(menu).slice(0, 20) : [];
  const systemTop = system ? Object.keys(system).slice(0, 20) : [];

  const menuScale =
    menu && typeof menu["scale"] === "object" && menu["scale"] !== null
      ? (menu["scale"] as Record<string, unknown>)
      : undefined;

  const menuScaleTitleNested =
    menuScale && typeof menuScale["title"] === "string"
      ? menuScale["title"]
      : undefined;

  const menuScaleTitleFlat =
    menu && typeof menu["scale.title"] === "string"
      ? menu["scale.title"]
      : undefined;

  const systemHideCat =
    system && typeof system["hideCat"] === "string"
      ? system["hideCat"]
      : undefined;

  const systemWrapperHideCat = (() => {
    if (!system) return undefined;
    const w = system["system"];
    if (typeof w !== "object" || w === null) return undefined;
    const wc = (w as Record<string, unknown>)["hideCat"];
    return typeof wc === "string" ? wc : undefined;
  })();

  const tMenuImplicit = i18n.t("scale.title", { ns: "menu" });
  const tMenuExplicit = i18n.t("scale.title", { ns: "menu", lng });

  const tSystemImplicit = i18n.t("system:hideCat");
  const tSystemExplicit = i18n.t("hideCat", { ns: "system", lng });

  const existsMenu = i18n.exists("scale.title", { ns: "menu", lng });
  const existsSystem = i18n.exists("hideCat", { ns: "system", lng });

  const resMenuKeySep = String(i18n.options.keySeparator);
  const resNsSep = String(i18n.options.nsSeparator);

  const getMenuNested = i18n.getResource(lng, "menu", "scale.title") as unknown;
  const getSystem = i18n.getResource(lng, "system", "hideCat") as unknown;

  const loadedMenu = i18n.hasLoadedNamespace("menu", { lng });
  const loadedSystem = i18n.hasLoadedNamespace("system", { lng });

  const { trLng, trKeySep, trNsSep } = getTranslatorInfo(i18n);

  const internal = getInternalDebug(i18n);

  const servicesRecord = i18n.services as unknown as Record<string, unknown>;

  const hasTranslator = !!servicesRecord["translator"];

  const isInitialized = i18n.isInitialized;

  const storeData = (() => {
    const store = servicesRecord["resourceStore"] as Record<string, unknown> | undefined;
    const data = store?.["data"] as Record<string, unknown> | undefined;
    return data ? Object.keys(data) : [];
  })();

  const directFixedT1 = i18n.t("menu:scale.title");
  const directFixedT2 = i18n.t("system:hideCat");
  const directFixedT3 = i18n.t("menu:scale.title", { lng: "de-DE" });
  const directFixedT4 = i18n.t("system:hideCat", { lng: "de-DE" });

  const sameInstance = i18n === appI18n;

  const fixedMenu = i18n.getFixedT(lng, "menu")("scale.title");
  const fixedSystem = i18n.getFixedT(lng, "system")("hideCat");

  const fixedMenuDe = i18n.getFixedT("de-DE", "menu")("scale.title");
  const fixedSystemDe = i18n.getFixedT("de-DE", "system")("hideCat");

  const defaultNS = JSON.stringify(i18n.options.defaultNS);
  const nsList = JSON.stringify(i18n.options.ns);
	
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
        maxWidth: 760,
        maxHeight: "70vh",
        overflow: "auto",
        whiteSpace: "pre-wrap",
      }}
    >
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
        `menu.scale exists: ${String(!!menuScale)}`,
        `menu.scale.title (nested): ${String(menuScaleTitleNested)}`,
        `menu["scale.title"] (flat): ${String(menuScaleTitleFlat)}`,
        "",
        `system.hideCat (direct): ${String(systemHideCat)}`,
        `system.system?.hideCat (wrapper): ${String(systemWrapperHideCat)}`,
        "",
        `options.keySeparator: ${resMenuKeySep}`,
        `options.nsSeparator: ${resNsSep}`,
        "",
        `exists(menu scale.title): ${String(existsMenu)}`,
        `exists(system hideCat): ${String(existsSystem)}`,
        "",
        `getResource(menu scale.title): ${String(getMenuNested)}`,
        `getResource(system hideCat): ${String(getSystem)}`,
        "",
        `hasLoadedNamespace(menu): ${String(loadedMenu)}`,
        `hasLoadedNamespace(system): ${String(loadedSystem)}`,
        `t(menu implicit): ${tMenuImplicit}`,
        `t(menu explicit lng): ${tMenuExplicit}`,
        `t(system implicit): ${tSystemImplicit}`,
        `t(system explicit lng): ${tSystemExplicit}`,
        "",
        `translator.language: ${trLng}`,
        `translator.options.keySeparator: ${trKeySep}`,
        `translator.options.nsSeparator: ${trNsSep}`,
        `init translator ready: ${String(internal.trReady)}`,
        `init services: ${internal.svcList?.join(", ") ?? "none"}`,
        `init error: ${internal.initErr ?? "none"}`,
        "",
        `isInitialized: ${String(isInitialized)}`,
        `hasTranslator: ${String(hasTranslator)}`,
        `resourceStore languages: ${JSON.stringify(storeData)}`,
        "",
        `direct t(menu:scale.title): ${directFixedT1}`,
        `direct t(system:hideCat): ${directFixedT2}`,
        `direct t(menu:scale.title, lng=de-DE): ${directFixedT3}`,
        `direct t(system:hideCat, lng=de-DE): ${directFixedT4}`,
        "",
        `sameInstance: ${String(sameInstance)}`,
        `defaultNS: ${defaultNS}`,
        `ns: ${nsList}`,
        `getFixedT(menu): ${fixedMenu}`,
        `getFixedT(system): ${fixedSystem}`,
        `getFixedT(menu,de-DE): ${fixedMenuDe}`,
        `getFixedT(system,de-DE): ${fixedSystemDe}`,
      ].join("\n")}
    </div>
  );
}
