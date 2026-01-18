import { en } from "./en";
import { pt } from "./pt";

export const translations = {
  en,
  pt,
} as const;

export type Locale = keyof typeof translations;
export const locales = Object.keys(translations) as Locale[];

/** -----------------------------
 *  Leaf JS-paths (objects only)
 *  ----------------------------- */

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

type Join<K extends string, P> = P extends string ? `${K}.${P}` : never;

/** Only leaf paths. Only supports objects (no arrays). */
export type LeafPaths<T> = T extends Primitive
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends Primitive
          ? K
          : Join<K, LeafPaths<T[K]>>;
      }[keyof T & string]
    : never;

/** All translation keys (union across locales, but should be identical due to checks) */
export type TranslationKey = LeafPaths<
  (typeof translations)[keyof typeof translations]
>;

export type TranslationObject = {
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  currentLocale: Locale;
};

export function t(
  key: TranslationKey,
  locale: Locale,
  params?: Record<string, string>,
): string {
  let translation: unknown = translations[locale];
  const parts = key.split(".");
  for (const part of parts) {
    if (!translation) break;
    translation = translation[
      part as unknown as keyof typeof translation
    ] as typeof translation;
  }
  if (typeof translation !== "string") {
    console.warn(`Missing translation for key "${key}" in locale "${locale}"`);
    return key;
  }
  let translationResult = translation as unknown as string;
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      const regex = new RegExp(`{${paramKey}}`, "g");
      translationResult = translationResult.replace(regex, paramValue);
    });
  }
  return translationResult;
}
