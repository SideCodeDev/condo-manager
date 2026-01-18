"use client";

import React from "react";
import { Locale, t, TranslationObject } from "./translations";

const I18nClientContext = React.createContext<{ locale: Locale }>({
  locale: "en",
});

export function I18nContextProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <I18nClientContext.Provider value={{ locale: locale }}>
      {children}
    </I18nClientContext.Provider>
  );
}

export function useI18n(): TranslationObject {
  const ctx = React.useContext(I18nClientContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nContextProvider");
  }
  return {
    t: (key, params) => t(key, ctx.locale, params),
    currentLocale: ctx.locale,
  };
}
