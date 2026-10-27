import Link from "next/link";
import { VehicleCard } from "@/components/vehicle-card";
import { buttonPrimary } from "@/components/button-styles";
import { fleetHref, searchVehicles } from "@/lib/catalog";
import { getSiteForLocale } from "@/lib/content";
import { getLocale } from "@/lib/locale";

function firstParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  return (raw ?? "").trim().slice(0, 80);
}

function pageNumbers(current: number, count: number) {
  const start = Math.max(1, current - 2);
  const end = Math.min(count, start + 4);
  const from = Math.max(1, end - 4);
  return Array.from({ length: end - from + 1 }, (_, index) => from + index);
}

export async function FleetBrowser({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const copy = site.fleetPage;
  const params = await searchParams;
  const query = firstParam(params.q);
  const category = firstParam(params.category);
  const passengersRaw = firstParam(params.passengers);
  const pageRaw = Number(firstParam(params.page));
  const parsedPassengers = /^\d+$/.test(passengersRaw) ? Number(passengersRaw) : null;
  const page = Number.isInteger(pageRaw) ? pageRaw : 1;
  let result = searchVehicles(locale, {
    query,
    category,
    minPassengers: parsedPassengers,
    page,
  });
  if (parsedPassengers !== null && !result.passengerOptions.includes(parsedPassengers)) {
    result = searchVehicles(locale, { query, category, minPassengers: null, page });
  }
  const activeCategory = result.categories.includes(category) ? category : "";
  const activePassengers = result.passengerOptions.includes(parsedPassengers ?? -1)
    ? parsedPassengers
    : null;
  const filtersActive = Boolean(query || activeCategory || activePassengers || result.page > 1);
  const resultLabel =
    result.total === 1
      ? copy.resultSingular
      : copy.resultPlural.replace("{count}", String(result.total));
  const pageLabel = copy.pageLabel
    .replace("{page}", String(result.page))
    .replace("{pages}", String(result.pageCount));
  const fieldClass =
    "h-12 w-full rounded-full border border-ivory/20 bg-navy px-4 text-sm text-ivory";

  return (
    <>
      <form action={`/${locale}/fleet`} className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.7fr))_auto] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {copy.searchLabel}
          </span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder={copy.searchPlaceholder}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {copy.categoryLabel}
          </span>
          <select name="category" defaultValue={activeCategory} className={fieldClass}>
            <option value="">{copy.allCategories}</option>
            {result.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            {copy.passengersLabel}
          </span>
          <select
            name="passengers"
            defaultValue={activePassengers ? String(activePassengers) : ""}
            className={fieldClass}
          >
            <option value="">{copy.anyPassengers}</option>
            {result.passengerOptions.map((count) => (
              <option key={count} value={count}>
                {copy.passengersOption.replace("{count}", String(count))}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={`${buttonPrimary} h-12 px-6`}>
          {copy.applyLabel}
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-mist">
        <p>{resultLabel}</p>
        {filtersActive ? (
          <Link href={`/${locale}/fleet`} className="font-semibold text-gold hover:text-ivory">
            {copy.clearLabel}
          </Link>
        ) : null}
      </div>
      {result.items.length === 0 ? (
        <p className="mt-10 text-mist">{copy.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map((vehicle) => (
            <li key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
      {result.pageCount > 0 ? (
        <nav className="mt-10 flex flex-wrap items-center justify-between gap-4" aria-label={copy.paginationLabel}>
          {result.page > 1 ? (
            <Link
              href={fleetHref(locale, {
                query,
                category: activeCategory,
                minPassengers: activePassengers,
                page: result.page - 1,
              })}
              className="text-sm font-semibold text-ivory hover:text-gold"
            >
              {copy.previousLabel}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-mist-dim">{copy.previousLabel}</span>
          )}
          <ol className="flex items-center gap-2">
            {pageNumbers(result.page, result.pageCount).map((page) => (
              <li key={page}>
                {page === result.page ? (
                  <span
                    aria-current="page"
                    className="flex h-10 min-w-10 items-center justify-center rounded-full bg-gold px-3 text-sm font-semibold text-navy"
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    href={fleetHref(locale, {
                      query,
                      category: activeCategory,
                      minPassengers: activePassengers,
                      page,
                    })}
                    className="flex h-10 min-w-10 items-center justify-center rounded-full border border-ivory/20 px-3 text-sm font-semibold text-ivory hover:border-ivory/70"
                  >
                    {page}
                  </Link>
                )}
              </li>
            ))}
          </ol>
          {result.page < result.pageCount ? (
            <Link
              href={fleetHref(locale, {
                query,
                category: activeCategory,
                minPassengers: activePassengers,
                page: result.page + 1,
              })}
              className="text-sm font-semibold text-ivory hover:text-gold"
            >
              {copy.nextLabel}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-mist-dim">{copy.nextLabel}</span>
          )}
          <p className="sr-only">{pageLabel}</p>
        </nav>
      ) : null}
    </>
  );
}
