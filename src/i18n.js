import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import EN_TRANSLATION from './locales/en/translation';
import EN_MESSAGE from './locales/en/message';
import VI_TRANSLATION from './locales/vi/translation';
import VI_MESSAGE from "./locales/en/message";

import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: EN_TRANSLATION,
    message: EN_MESSAGE,
  },
  vi: {
    translation: VI_TRANSLATION,
    message: VI_MESSAGE
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupCookie: "lang",
      lookupLocalStorage: "lang",
      caches: ["localStorage", "cookie"],
    },
    lng: "vi",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;