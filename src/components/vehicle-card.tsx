import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { getSiteForLocale, safeImagePosition } from "@/lib/content";
import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { Vehicle } from "@/lib/types";
import { fillTemplate, inquiryLink } from "@/lib/whatsapp";

function capacity(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export async function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const message = fillTemplate(site.messages.vehicle, { vehicle: vehicle.name });
  const link = inquiryLink(site.whatsappNumber, message);
  const label = link.external
    ? `${site.fleet.inquireLabel}: ${vehicle.name}`
    : site.ui.whatsappUnavailable;

  return (
    <article className="relative overflow-hidden rounded-2xl bg-surface">
      <Link href={localizeHref(locale, `/fleet/${vehicle.id}`)} className="group block">
        <div className="relative aspect-[16/10]">
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: safeImagePosition(vehicle.imagePosition) }}
          />
        </div>
        <div className="px-5 py-5 pe-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {vehicle.category}
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-ivory group-hover:text-gold">
            {vehicle.name}
          </h3>
          <p className="mt-2 text-sm text-mist-dim">
            {site.fleet.passengersLabel} {capacity(site.fleet.capacityValue, vehicle.passengers)}
            {" · "}
            {site.fleet.luggageLabel} {capacity(site.fleet.capacityValue, vehicle.luggage)}
          </p>
          {vehicle.price ? (
            <p className="mt-2 text-sm text-ivory">
              {site.fleet.priceLabel} {vehicle.price}
            </p>
          ) : null}
        </div>
      </Link>
      <WhatsAppLink
        href={link.href}
        external={link.external}
        label={label}
        className="absolute end-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </WhatsAppLink>
    </article>
  );
}
