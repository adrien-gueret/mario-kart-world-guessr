import { createContext, useContext, useState, type ReactNode } from "react";

import en from "./translations/en";
import fr from "./translations/fr";

import type { TranslationsContextType, Locale, Translations } from "./types";

const translations: Translations = { fr, en } as const;

const TranslationsContext = createContext<TranslationsContextType>({
  currentLocale: "fr",
  translate: () => "",
  setCurrentLocale: () => {},
} as TranslationsContextType);

const setDocumentLanguage = (locale: Locale) => {
  document.documentElement.lang = locale;
};

export function TranslationsProvider({ children }: { children: ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    const userLang = navigator.language || navigator.languages[0];

    if (userLang.startsWith("fr")) {
      setDocumentLanguage("fr");
      return "fr";
    }

    setDocumentLanguage("en");
    return "en";
  });

  const translate: TranslationsContextType["translate"] = (key) => {
    return translations[currentLocale][key];
  };

  const setLocale = (locale: Locale) => {
    setCurrentLocale(locale);
    setDocumentLanguage(locale);
  };

  return (
    <TranslationsContext
      value={{ currentLocale, translate, setCurrentLocale: setLocale }}
    >
      {children}
    </TranslationsContext>
  );
}

export function useTranslations() {
  const context = useContext(TranslationsContext);

  if (!context) {
    throw new Error(
      "useTranslations must be used within a TranslationsProvider"
    );
  }

  return context;
}
