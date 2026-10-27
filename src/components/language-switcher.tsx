"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { locales, swapLocale, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  en: "EN",
  ar: "عربي",
};

export function LanguageSwitcherFallback() {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-ivory/40">
      EN
      <span aria-hidden="true">/</span>
      عربي
    </span>
  );
}

export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname() || "/en";
  const search = useSearchParams().toString();
  const current: Locale = pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";

  return (
    <nav aria-label={label} className="flex items-center gap-2 text-xs font-semibold">
      {locales.map((locale, index) => {
        const href = `${swapLocale(pathname, locale)}${search ? `?${search}` : ""}`;
        const active = locale === current;
        return (
          <span key={locale} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-ivory/30">
                /
              </span>
            ) : null}
            {active ? (
              <span aria-current="true" lang={locale} className="text-gold">
                {labels[locale]}
              </span>
            ) : (
              <Link href={href} hrefLang={locale} lang={locale} className="text-ivory/75 hover:text-ivory">
                {labels[locale]}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
