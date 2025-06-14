import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import ptTranslation from "@/languages/locales/pt.json"
import esTranslation from "@/languages/locales/es.json"
import enTranslation from "@/languages/locales/en.json"

const resources = {
  pt: {
    translation: ptTranslation,
  },
  es: {
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  debug: false,

  interpolation: {
    escapeValue: false,
  },
})

export default i18n
