import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { cookieName } from "./proxy";
import { Locale, locales, t, TranslationObject } from "./translations";

const getLocale = cache(async () => {
  const cookiesStore = await cookies();
  const locale = cookiesStore.get(cookieName)?.value?.toLocaleLowerCase() as
    | Locale
    | undefined;
  return locale && locales.includes(locale) ? locale : "en";
});

export const getI18n = cache(async (): Promise<TranslationObject> => {
  const currentLocale = await getLocale();
  return {
    currentLocale,
    t: (key, params) => t(key, currentLocale, params),
  };
});
