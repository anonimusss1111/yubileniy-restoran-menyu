import type { Lang } from "./i18n";

const suffixes: Record<Lang, string> = {
  uz: "so'm",
  ru: "сум",
  en: "UZS",
};

export function formatPrice(price: number, lang: Lang = "uz"): string {
  const formatted = new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(price).replace(/,/g, " ");
  return `${formatted} ${suffixes[lang]}`;
}
