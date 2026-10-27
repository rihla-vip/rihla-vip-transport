import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { FleetBrowser } from "@/components/fleet-browser";
import { getSiteForLocale, getSiteUrl } from "@/lib/content";
import { isLocale, pageAlternates } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/fleet">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const site = getSiteForLocale(lang);
  return {
    title: site.fleetPage.title,
    description: site.fleetPage.intro,
    ...pageAlternates(getSiteUrl(), lang, "/fleet"),
  };
}

export default async function FleetPage({
  params,
  searchParams,
}: PageProps<"/[lang]/fleet">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const site = getSiteForLocale(lang);

  return (
    <section className="pt-28 pb-16 lg:pt-32 lg:pb-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          — {site.fleetPage.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,4.5vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.04em] text-ivory">
          {site.fleetPage.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist">{site.fleetPage.intro}</p>
        <Suspense fallback={<p className="mt-10 text-mist">{site.ui.loadingVehicles}</p>}>
          <FleetBrowser searchParams={searchParams} />
        </Suspense>
      </Container>
    </section>
  );
}
