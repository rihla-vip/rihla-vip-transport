export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizeHref(locale: Locale, href: string) {
  if (href.startsWith("#")) return `/${locale}${href}`;
  const hashIndex = href.indexOf("#");
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  if (!path.startsWith("/")) return href;
  const suffix = path === "/" ? "" : path;
  return `/${locale}${suffix}${hash}`;
}

export function swapLocale(pathname: string, locale: Locale) {
  const hashIndex = pathname.indexOf("#");
  const path = hashIndex === -1 ? pathname : pathname.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : pathname.slice(hashIndex);
  const segments = path.split("/");
  if (segments[1] === "en" || segments[1] === "ar") segments[1] = locale;
  else segments.splice(1, 0, locale);
  const next = segments.join("/") || `/${locale}`;
  return `${next}${hash}`;
}

export function pageAlternates(siteUrl: string | null, locale: Locale, unprefixedPath: string) {
  if (!siteUrl) return {};
  const suffix = unprefixedPath === "/" ? "" : unprefixedPath;
  return {
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: {
        en: `/en${suffix}`,
        ar: `/ar${suffix}`,
      },
    },
  };
}
