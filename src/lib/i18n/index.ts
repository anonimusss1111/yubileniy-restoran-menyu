import { uz } from "./uz";
import { ru } from "./ru";
import { en } from "./en";
import type { Dictionary } from "./uz";

export type Lang = "uz" | "ru" | "en";

const dictionaries: Record<Lang, Dictionary> = { uz, ru, en };

export function getDict(lang: Lang = "uz"): Dictionary {
  return dictionaries[lang] || uz;
}

export function pick<T extends Record<string, any>>(
  obj: T,
  key: string,
  lang: Lang
): string {
  const uzKey = `${key}Uz` as keyof T;
  const langKey = `${key}${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof T;
  return (obj[langKey] as string) || (obj[uzKey] as string) || "";
}
