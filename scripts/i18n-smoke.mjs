import fs from "node:fs";
import path from "node:path";
import i18next from "i18next";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const root = process.cwd();
const locales = path.join(root, "src", "locales");

// passe das an deine echten Namespace-Dateien an:
const NAMESPACES = ["menu", "system", "window", "models", "motions", "expressions", "ui"];
const LANGS = ["en-US", "de-DE", "zh-CN"];

const resources = {};
for (const lng of LANGS) {
  resources[lng] = {};
  for (const ns of NAMESPACES) {
    const file = path.join(locales, lng, `${ns}.json`);
    if (!fs.existsSync(file)) {
      console.log(`[SMOKE] MISSING: ${lng}/${ns}.json`);
      continue;
    }
    resources[lng][ns] = readJson(file);
  }
}

await i18next.init({
  resources,
  lng: "en-US",
  fallbackLng: "en-US",
  ns: NAMESPACES,
  defaultNS: "menu",
  initImmediate: false,
  interpolation: { escapeValue: false }
});

console.log("[SMOKE] has en-US/menu:", i18next.hasResourceBundle("en-US", "menu"));
console.log("[SMOKE] t(menu:scale.title):", i18next.t("scale.title", { ns: "menu" }));
console.log("[SMOKE] has en-US/system:", i18next.hasResourceBundle("en-US", "system"));
console.log("[SMOKE] t(system:hideCat):", i18next.t("system:hideCat"));

console.log("[SMOKE] has de-DE/menu:", i18next.hasResourceBundle("de-DE", "menu"));
console.log("[SMOKE] t(de-DE menu:scale.title):", i18next.t("scale.title", { ns: "menu", lng: "de-DE" }));

console.log("[SMOKE] has zh-CN/menu:", i18next.hasResourceBundle("zh-CN", "menu"));
console.log("[SMOKE] t(zh-CN menu:scale.title):", i18next.t("scale.title", { ns: "menu", lng: "zh-CN" }));
