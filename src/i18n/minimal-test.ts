import i18next from "i18next";

export async function runMinimalI18nTest() {
  const testI18n = i18next.createInstance();

  await testI18n.init({
    lng: "de-DE",
    fallbackLng: "en-US",
    ns: ["menu", "system"],
    defaultNS: "menu",
    resources: {
      "de-DE": {
        menu: {
          scale: {
            title: "INLINE Skalierung",
          },
        },
        system: {
          hideCat: "INLINE Katze ausblenden",
        },
      },
      "en-US": {
        menu: {
          scale: {
            title: "INLINE Scale",
          },
        },
        system: {
          hideCat: "INLINE Hide Cat",
        },
      },
    },
    interpolation: { escapeValue: false },
    initImmediate: false,
  });

  console.log("[minimal i18n test]", {
    menuImplicit: testI18n.t("scale.title", { ns: "menu", lng: "de-DE" }),
    systemImplicit: testI18n.t("hideCat", { ns: "system", lng: "de-DE" }),
    menuPrefixed: testI18n.t("menu:scale.title", { lng: "de-DE" }),
    systemPrefixed: testI18n.t("system:hideCat", { lng: "de-DE" }),
    getMenu: testI18n.getResource("de-DE", "menu", "scale.title"),
    getSystem: testI18n.getResource("de-DE", "system", "hideCat"),
  });
}
