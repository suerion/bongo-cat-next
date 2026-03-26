"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh-CN",
    fallbackLng: "zh-CN",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "bongo-cat-language",
    },
  });

export default i18n;
