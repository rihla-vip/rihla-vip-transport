import type { Metadata } from "next";
import { Articles } from "@/components/articles";
import { Faq } from "@/components/faq";
import { Fleet } from "@/components/fleet";
import { Hero } from "@/components/hero";
import { getSiteForLocale, getSiteUrl } from "@/lib/content";
import { isLocale, pageAlternates } from "@/lib/i18n";
import { jsonLdScript, organizationJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageAlternates(getSiteUrl(), lang, "/");
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const site = getSiteForLocale(lang);
  const jsonLd = organizationJsonLd(site, getSiteUrl());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Hero />
      <Fleet />
      <Articles />
      <Faq />
    </>
  );
}
