import type { Locale } from "@/lib/i18n";

const MONTHS: Record<Locale, string[]> = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ar: [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
};

export function formatPublishedDate(value: string, locale: Locale) {
  const [year, month, day] = value.split("-");
  const monthName = MONTHS[locale][Number(month) - 1];
  const dayNumber = Number(day);
  if (!year || !monthName || !dayNumber) return value;
  if (locale === "ar") return `${dayNumber} ${monthName} ${year}`;
  return `${monthName} ${dayNumber}, ${year}`;
}
