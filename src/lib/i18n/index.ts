import { uz, type Dictionary } from "./uz";
import { ru } from "./ru";
import { en } from "./en";

export type { Dictionary };
export type Lang = "uz" | "ru" | "en";

const dictionaries: Record<Lang, Dictionary> = { uz, ru, en };

export function getDict(lang: Lang = "uz"): Dictionary {
  return dictionaries[lang] || uz;
}

export function pick(
  obj: Record<string, unknown>,
  key: string,
  lang: Lang
): string {
  const uzKey = `${key}Uz`;
  const langKey = `${key}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
  const langVal = obj[langKey];
  const uzVal = obj[uzKey];
  if (typeof langVal === "string") return langVal;
  if (typeof uzVal === "string") return uzVal;
  return "";
}
