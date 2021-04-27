import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enUs from "./enUs/translation.json";
import nbNo from "./nbNo/translation.json";

export const resources = {
  "en-US": {
    translation: enUs,
  },
  "nb-NO": {
    translation: nbNo,
  },
  nb: {
    translation: nbNo,
  },
  no: {
    translation: nbNo,
  },
} as const;

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "en-US",
});
