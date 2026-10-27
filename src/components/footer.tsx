import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonPrimary } from "@/components/button-styles";
import { Container } from "@/components/container";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getSiteForLocale } from "@/lib/content";
import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { inquiryLink, isWhatsappConfigured } from "@/lib/whatsapp";

function Mark({ name }: { name: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-sm font-semibold text-navy">
      {name.slice(0, 1)}
    </span>
  );
}

export async function Footer() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const link = inquiryLink(site.whatsappNumber, site.messages.general);
  const configured = isWhatsappConfigured(site.whatsappNumber);
  const label = configured ? site.footer.inquiryLabel : site.ui.whatsappUnavailable;

  return (
    <footer id="contact" className="border-t border-ivory/10 bg-navy-deep">
      <Container className="grid gap-10 py-14 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <Link href={localizeHref(locale, "/")} className="inline-flex items-center gap-2.5 text-ivory">
            <Mark name={site.companyName} />
            <span className="text-sm font-semibold tracking-[0.16em] uppercase rtl:tracking-normal">
              {site.companyName}
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{site.footer.blurb}</p>
        </div>
        <nav className="md:col-span-3" aria-label={site.ui.footerNavLabel}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            {site.footer.exploreLabel}
          </p>
          <ul className="mt-4 space-y-3">
            {site.footerNavigation.map((item) => (
              <li key={item.href}>
                <a
                  href={localizeHref(locale, item.href)}
                  className="text-sm text-ivory/80 transition-colors hover:text-ivory"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4 md:flex md:flex-col md:items-end">
          <WhatsAppLink
            href={link.href}
            external={link.external}
            label={label}
            className={`${buttonPrimary} h-12 px-6`}
          >
            {site.footer.inquiryLabel}
            <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
          </WhatsAppLink>
          {configured ? null : (
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist md:text-end">
              {site.contact.pendingNote}
            </p>
          )}
          <ul className="mt-4 space-y-2 text-sm text-mist md:text-end">
            {site.phone ? (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </li>
            ) : null}
            {site.email ? (
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            ) : null}
            {site.businessHours ? <li>{site.businessHours}</li> : null}
          </ul>
        </div>
      </Container>
      <Container className="border-t border-ivory/10 py-5">
        <p className="text-xs text-mist-dim">
          © {site.copyrightYear} {site.companyName}. {site.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
