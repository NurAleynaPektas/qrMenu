import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./i18n/en.json";
import tr from "./i18n/tr.json";
import fr from "./i18n/fr.json";

const savedLng = localStorage.getItem("lng") || "tr";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
    fr: { translation: fr },
  },
  lng: savedLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});


i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
  document.documentElement.setAttribute("dir", "ltr");
  localStorage.setItem("lng", lng);
});

export default i18n;
