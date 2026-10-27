import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { buttonPrimary, buttonSecondary } from "@/components/button-styles";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getSiteForLocale, safeImagePosition } from "@/lib/content";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { inquiryLink } from "@/lib/whatsapp";

function Headline({ text }: { text: string }) {
  const lines = text.split("\n").filter((line) => line.length > 0);
  return (
    <h1 className="mt-5 text-[clamp(3.1rem,6vw,5.35rem)] font-medium leading-[0.96] tracking-[-0.045em]">
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={`block ${index === lines.length - 1 ? "text-gold" : "text-ivory"}`}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}

function mirrorPosition(position: string, locale: Locale) {
  if (locale !== "ar") return position;
  const [x, y] = position.trim().split(/\s+/);
  const mirrored =
    x.endsWith("%")
      ? `${100 - Number.parseInt(x, 10)}%`
      : x === "left"
        ? "right"
        : x === "right"
          ? "left"
          : x;
  return y ? `${mirrored} ${y}` : mirrored;
}

export async function Hero() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const link = inquiryLink(site.whatsappNumber, site.messages.general);
  const label = link.external ? site.hero.primaryCta : site.ui.whatsappUnavailable;

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-navy">
      <Image
        src={site.hero.image}
        alt={site.hero.imageAlt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: safeImagePosition(mirrorPosition(site.hero.imagePosition, locale)) }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/25 lg:from-navy lg:from-[18%] lg:via-navy/80 lg:via-[42%] lg:to-transparent ${locale === "ar" ? "lg:bg-gradient-to-l" : "lg:bg-gradient-to-r"}`}
      />
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[90rem] items-end px-5 sm:px-8 lg:items-center lg:px-12">
        <div className="max-w-xl py-12 lg:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            {site.hero.eyebrow}
          </p>
          <Headline text={site.hero.headline} />
          <p className="mt-6 max-w-[38ch] text-pretty text-base leading-relaxed text-mist sm:text-lg">
            {site.hero.supporting}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppLink
              href={link.href}
              external={link.external}
              label={label}
              className={`${buttonPrimary} h-12 px-6`}
            >
              {site.hero.primaryCta}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
            </WhatsAppLink>
            <a href={localizeHref(locale, site.hero.secondaryHref)} className={`${buttonSecondary} h-12 px-6`}>
              {site.hero.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
