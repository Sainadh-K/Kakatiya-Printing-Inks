import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
// NOTE: te.json and hi.json translations should be reviewed with a native speaker
// before launch. Brand names and printing jargon (flexo, corrugated, viscosity,
// Pantone) are intentionally transliterated rather than translated, as they read
// more naturally to trade buyers that way.
import te from "./locales/te.json"; // review with a native speaker before launch
import hi from "./locales/hi.json"; // review with a native speaker before launch

export const SUPPORTED_LANGUAGES = ["en", "te", "hi"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const resources = {
  en: { translation: en },
  te: { translation: te },
  hi: { translation: hi },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    // Only match the base language (e.g. "en-IN" -> "en")
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      // Persist the choice, then fall back to browser language on first visit
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "kpi-lang",
      caches: ["localStorage"],
    },
  });

// Keep <html lang> in sync so language-aware font stacks & screen readers work.
const applyHtmlLang = (lng: string) => {
  const base = (lng || "en").split("-")[0];
  document.documentElement.lang = base;
};
applyHtmlLang(i18n.language);
i18n.on("languageChanged", applyHtmlLang);

export default i18n;
