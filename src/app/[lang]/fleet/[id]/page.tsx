import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lang as langParam } from "next/root-params";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getVehicleById } from "@/lib/catalog";
import { getSiteForLocale, getSiteUrl, getVehiclesForLocale, safeImagePosition } from "@/lib/content";
import { isLocale, localizeHref, pageAlternates } from "@/lib/i18n";
import { fillTemplate, inquiryLink } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const value = await langParam();
  if (!isLocale(value)) return [];
  return getVehiclesForLocale(value).map((vehicle) => ({ id: vehicle.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/fleet/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const vehicle = getVehicleById(lang, id);
  if (!vehicle) return { title: "Vehicle" };
  return {
    title: vehicle.name,
    description: vehicle.description,
    ...pageAlternates(getSiteUrl(), lang, `/fleet/${vehicle.id}`),
  };
}

export default function VehiclePage({ params }: PageProps<"/[lang]/fleet/[id]">) {
  return (
    <Suspense fallback={<p className="px-5 pt-32 text-mist">…</p>}>
      <VehicleDetail params={params} />
    </Suspense>
  );
}

function capacity(template: string, count: number) {
  return template.replace("{count}", String(count));
}

async function VehicleDetail({ params }: Pick<PageProps<"/[lang]/fleet/[id]">, "params">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const vehicle = getVehicleById(lang, id);
  if (!vehicle) notFound();

  const site = getSiteForLocale(lang);
  const message = fillTemplate(site.messages.vehicle, { vehicle: vehicle.name });
  const link = inquiryLink(site.whatsappNumber, message);
  const label = link.external
    ? `${site.fleet.inquireLabel}: ${vehicle.name}`
    : site.ui.whatsappUnavailable;

  return (
    <article className="pt-28 pb-28 lg:pt-32 lg:pb-32">
      <Container>
        <Link
          href={localizeHref(lang, "/fleet")}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:text-ivory"
        >
          {site.vehiclePage.backLabel}
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {vehicle.category}
        </p>
        <h1 className="mt-3 max-w-4xl text-[clamp(2.4rem,4.5vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.04em] text-ivory">
          {vehicle.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mist">{vehicle.description}</p>
        <p className="mt-4 text-sm text-mist-dim">
          {site.fleet.passengersLabel} {capacity(site.fleet.capacityValue, vehicle.passengers)}
          {" · "}
          {site.fleet.luggageLabel} {capacity(site.fleet.capacityValue, vehicle.luggage)}
        </p>
        {vehicle.suitability ? <p className="mt-2 text-sm text-ivory">{vehicle.suitability}</p> : null}
        {vehicle.price ? (
          <p className="mt-2 text-sm text-ivory">
            {site.fleet.priceLabel} {vehicle.price}
          </p>
        ) : null}
        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-2xl">
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt}
            fill
            sizes="(min-width: 1024px) 90rem, 100vw"
            className="object-cover"
            style={{ objectPosition: safeImagePosition(vehicle.imagePosition) }}
          />
        </div>
        {vehicle.features.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2">
            {vehicle.features.map((feature) => (
              <li
                key={feature}
                className="rounded-full border border-ivory/15 px-4 py-2 text-sm text-ivory"
              >
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
      <WhatsAppLink
        href={link.href}
        external={link.external}
        label={label}
        className="fixed end-5 bottom-5 z-40 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white"
      >
        <WhatsAppIcon className="h-4 w-4" />
        {site.ui.headerCta}
      </WhatsAppLink>
    </article>
  );
}
