"use client";
import { runMinimalI18nTest } from "./minimal-test";
import i18next, { type i18n as I18nType } from "i18next";
//import { initReactI18next } from "react-i18next";

import zhCNMenu from "@/locales/zh-CN/menu.json";
import zhCNWindow from "@/locales/zh-CN/window.json";
import zhCNModels from "@/locales/zh-CN/models.json";
import zhCNSystem from "@/locales/zh-CN/system.json";
import zhCNMotions from "@/locales/zh-CN/motions.json";
import zhCNExpressions from "@/locales/zh-CN/expressions.json";
import zhCNUI from "@/locales/zh-CN/ui.json";

import enUSMenu from "@/locales/en-US/menu.json";
import enUSWindow from "@/locales/en-US/window.json";
import enUSModels from "@/locales/en-US/models.json";
import enUSSystem from "@/locales/en-US/system.json";
import enUSMotions from "@/locales/en-US/motions.json";
import enUSExpressions from "@/locales/en-US/expressions.json";
import enUSUI from "@/locales/en-US/ui.json";

import deDEMenu from "@/locales/de-DE/menu.json";
import deDEWindow from "@/locales/de-DE/window.json";
import deDEModels from "@/locales/de-DE/models.json";
import deDESystem from "@/locales/de-DE/system.json";
import deDEMotions from "@/locales/de-DE/motions.json";
import deDEExpressions from "@/locales/de-DE/expressions.json";
import deDEUI from "@/locales/de-DE/ui.json";

const namespaces = ["menu", "window", "models", "system", "motions", "expressions", "ui"] as const;

function toPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const resources = {
  "zh-CN": {
    menu: toPlainObject(zhCNMenu),
    window: toPlainObject(zhCNWindow),
    models: toPlainObject(zhCNModels),
    system: toPlainObject(zhCNSystem),
    motions: toPlainObject(zhCNMotions),
    expressions: toPlainObject(zhCNExpressions),
    ui: toPlainObject(zhCNUI),
  },
  "en-US": {
    menu: toPlainObject(enUSMenu),
    window: toPlainObject(enUSWindow),
    models: toPlainObject(enUSModels),
    system: toPlainObject(enUSSystem),
    motions: toPlainObject(enUSMotions),
    expressions: toPlainObject(enUSExpressions),
    ui: toPlainObject(enUSUI),
  },
  "de-DE": {
    menu: toPlainObject(deDEMenu),
    window: toPlainObject(deDEWindow),
    models: toPlainObject(deDEModels),
    system: toPlainObject(deDESystem),
    motions: toPlainObject(deDEMotions),
    expressions: toPlainObject(deDEExpressions),
    ui: toPlainObject(deDEUI),
  },
} as const;

/*
const resources = {
  "zh-CN": {
    menu: zhCNMenu,
    window: zhCNWindow,
    models: zhCNModels,
    system: zhCNSystem,
    motions: zhCNMotions,
    expressions: zhCNExpressions,
    ui: zhCNUI,
  },
  "en-US": {
    menu: enUSMenu,
    window: enUSWindow,
    models: enUSModels,
    system: enUSSystem,
    motions: enUSMotions,
    expressions: enUSExpressions,
    ui: enUSUI,
  },
  "de-DE": {
    menu: deDEMenu,
    window: deDEWindow,
    models: deDEModels,
    system: deDESystem,
    motions: deDEMotions,
    expressions: deDEExpressions,
    ui: deDEUI,
  },
} as const;
*/

const i18n: I18nType = i18next.createInstance();

i18n
  .init({
    resources,
    lng: "de-DE",
    fallbackLng: "en-US",
    supportedLngs: ["zh-CN", "en-US", "de-DE"],
    nonExplicitSupportedLngs: true,
    ns: [...namespaces],
    defaultNS: "menu",
    interpolation: { escapeValue: false },
    debug: false,
  })
	
.then(async () => {
	await runMinimalI18nTest()
  const services = i18n.services as unknown as Record<string, unknown> | undefined;
  const store = services?.["resourceStore"] as Record<string, unknown> | undefined;
  const data = store?.["data"] as Record<string, unknown> | undefined;

  const defaultNS = i18n.options.defaultNS as unknown;
  const ns = i18n.options.ns as unknown;
  const keySeparator = i18n.options.keySeparator as unknown;
  const nsSeparator = i18n.options.nsSeparator as unknown;

  const rawMenu = i18n.t("menu:scale.title", { lng: "de-DE" });
  const rawSystem = i18n.t("system:hideCat", { lng: "de-DE" });
  const fixedMenu = i18n.getFixedT("de-DE", "menu")("scale.title");
  const fixedSystem = i18n.getFixedT("de-DE", "system")("hideCat");

  const getMenu = i18n.getResource("de-DE", "menu", "scale.title") as unknown;
  const getSystem = i18n.getResource("de-DE", "system", "hideCat") as unknown;

  console.log("[i18n init ok]", {
    language: i18n.language,
    resolvedLanguage: i18n.resolvedLanguage,
    languages: i18n.languages,
    isInitialized: i18n.isInitialized,
    defaultNS: JSON.stringify(defaultNS),
    ns: JSON.stringify(ns),
    keySeparator: String(keySeparator),
    nsSeparator: String(nsSeparator),
    hasMenuBundle: i18n.hasResourceBundle("de-DE", "menu"),
    hasSystemBundle: i18n.hasResourceBundle("de-DE", "system"),
    rawMenu,
    rawSystem,
    fixedMenu,
    fixedSystem,
    getMenu: String(getMenu),
    getSystem: String(getSystem),
    storeLanguages: data ? Object.keys(data) : [],
    serviceKeys: services ? Object.keys(services) : [],
  });
})
  .catch((e: unknown) => {
    console.error("[i18n] init failed:", e);
  });

export default i18n;
