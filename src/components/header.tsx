import { HeaderBar } from "@/components/header-bar";
import { getSiteForLocale } from "@/lib/content";
import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { inquiryLink } from "@/lib/whatsapp";

export async function Header() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const link = inquiryLink(site.whatsappNumber, site.messages.general);

  return (
    <HeaderBar
      companyName={site.companyName}
      logo={site.logo}
      navigation={site.navigation.map((item) => ({
        ...item,
        href: localizeHref(locale, item.href),
      }))}
      headerCta={site.ui.headerCta}
      ctaHref={link.href}
      ctaExternal={link.external}
      ctaAriaLabel={link.external ? site.ui.headerCta : site.ui.whatsappUnavailable}
      openLabel={site.ui.openMenu}
      closeLabel={site.ui.closeMenu}
      navLabel={site.ui.mobileNavLabel}
      primaryNavLabel={site.ui.primaryNavLabel}
      homeHref={localizeHref(locale, "/")}
      languageLabel={site.ui.languageLabel}
    />
  );
}

export async function SkipLink() {
  const site = getSiteForLocale(await getLocale());
  return (
    <a href="#content" className="skip-link">
      {site.ui.skipToContent}
    </a>
  );
}
