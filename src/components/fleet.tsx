import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/container";
import { VehicleCard } from "@/components/vehicle-card";
import { getSiteForLocale, getVehiclesForLocale } from "@/lib/content";
import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { Vehicle } from "@/lib/types";

function featuredVehicles(vehicles: Vehicle[]) {
  const featured = vehicles.filter((vehicle) => vehicle.featured);
  const rest = vehicles.filter((vehicle) => !vehicle.featured);
  return [...featured, ...rest].slice(0, 3);
}

export async function Fleet() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const vehicles = featuredVehicles(getVehiclesForLocale(locale));
  const lines = site.fleet.title.split("\n").filter((line) => line.length > 0);

  return (
    <section id={site.fleet.id} className="py-16 lg:py-24" aria-labelledby="fleet-title">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              — {site.fleet.eyebrow}
            </p>
            <h2
              id="fleet-title"
              className="mt-4 text-[clamp(2.4rem,4.5vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.04em]"
            >
              {lines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={`block ${index === lines.length - 1 ? "text-gold" : "text-ivory"}`}
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-mist">{site.fleet.intro}</p>
            <Link
              href={localizeHref(locale, site.fleet.viewAllHref)}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-ivory"
            >
              {site.fleet.viewAllLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
        {vehicles.length === 0 ? (
          <p className="mt-10 text-mist">{site.fleet.empty}</p>
        ) : (
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <li key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
