"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { buttonPrimary } from "@/components/button-styles";
import { Container } from "@/components/container";
import { LanguageSwitcher, LanguageSwitcherFallback } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { WhatsAppLink } from "@/components/whatsapp-link";
import type { NavLink } from "@/lib/types";

function Mark({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold text-sm font-semibold text-navy"
    >
      {name.slice(0, 1)}
    </span>
  );
}

export function HeaderBar({
  companyName,
  logo,
  navigation,
  headerCta,
  ctaHref,
  ctaExternal,
  ctaAriaLabel,
  openLabel,
  closeLabel,
  navLabel,
  primaryNavLabel,
  homeHref,
  languageLabel,
}: {
  companyName: string;
  logo: string;
  navigation: NavLink[];
  headerCta: string;
  ctaHref: string;
  ctaExternal: boolean;
  ctaAriaLabel: string;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
  primaryNavLabel: string;
  homeHref: string;
  languageLabel: string;
}) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        solid ? "border-b border-ivory/10 bg-navy" : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-4">
        <Link href={homeHref} className="flex min-w-0 items-center gap-2.5 text-ivory">
          {logo ? (
            <Image src={logo} alt="" width={140} height={36} className="h-8 w-auto" />
          ) : (
            <Mark name={companyName} />
          )}
          <span className={logo ? "sr-only" : "truncate text-sm font-semibold tracking-[0.16em] uppercase rtl:tracking-normal"}>
            {companyName}
          </span>
        </Link>
        <div className="flex items-center justify-end gap-8">
          <nav className="hidden items-center gap-8 md:flex" aria-label={primaryNavLabel}>
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-ivory/85 transition-colors hover:text-ivory rtl:tracking-normal"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Suspense fallback={<LanguageSwitcherFallback />}>
              <LanguageSwitcher label={languageLabel} />
            </Suspense>
            <WhatsAppLink
              href={ctaHref}
              external={ctaExternal}
              label={ctaAriaLabel}
              className={`${buttonPrimary} hidden h-11 px-5 md:inline-flex`}
            >
              {headerCta}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
            </WhatsAppLink>
            <MobileNav
              links={navigation}
              ctaLabel={headerCta}
              ctaHref={ctaHref}
              ctaExternal={ctaExternal}
              ctaAriaLabel={ctaAriaLabel}
              openLabel={openLabel}
              closeLabel={closeLabel}
              navLabel={navLabel}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
