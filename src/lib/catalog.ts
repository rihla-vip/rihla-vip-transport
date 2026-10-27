import { getArticlesForLocale, getVehiclesForLocale } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { Article, Vehicle } from "@/lib/types";

/**
 * Reads for vehicles and articles. JSON stands in for the database.
 * Replace the bodies of these functions when a database is connected.
 * Keep the arguments and return values the same so the pages do not change.
 */

export const FLEET_PAGE_SIZE = 6;

export type VehicleSearch = {
  query: string;
  category: string;
  minPassengers: number | null;
  page: number;
};

export type VehicleSearchResult = {
  items: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  categories: string[];
  passengerOptions: number[];
};

export function searchVehicles(locale: Locale, input: VehicleSearch): VehicleSearchResult {
  const vehicles = getVehiclesForLocale(locale);
  const categories = [...new Set(vehicles.map((vehicle) => vehicle.category))].sort((a, b) =>
    a.localeCompare(b),
  );
  const passengerOptions = [...new Set(vehicles.map((vehicle) => vehicle.passengers))].sort(
    (a, b) => a - b,
  );
  const query = input.query.trim().toLowerCase();
  const category = categories.includes(input.category) ? input.category : "";
  const minPassengers =
    input.minPassengers !== null && input.minPassengers > 0 ? input.minPassengers : null;

  const filtered = vehicles.filter((vehicle) => {
    if (category && vehicle.category !== category) return false;
    if (minPassengers !== null && vehicle.passengers < minPassengers) return false;
    if (!query) return true;
    const haystack = [
      vehicle.name,
      vehicle.category,
      vehicle.description,
      vehicle.suitability,
      ...vehicle.features,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  const pageSize = FLEET_PAGE_SIZE;
  const pageCount = filtered.length === 0 ? 0 : Math.ceil(filtered.length / pageSize);
  const requested = Number.isInteger(input.page) && input.page > 0 ? input.page : 1;
  const page = pageCount === 0 ? 1 : Math.min(requested, pageCount);
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    pageCount,
    categories,
    passengerOptions,
  };
}

export function getVehicleById(locale: Locale, id: string): Vehicle | null {
  return getVehiclesForLocale(locale).find((vehicle) => vehicle.id === id) ?? null;
}

export function listArticles(locale: Locale): Article[] {
  return getArticlesForLocale(locale);
}

export function featuredArticles(locale: Locale, limit: number): Article[] {
  const articles = listArticles(locale);
  const featured = articles.filter((article) => article.featured);
  const rest = articles.filter((article) => !article.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getArticleBySlug(locale: Locale, slug: string): Article | null {
  return listArticles(locale).find((article) => article.slug === slug) ?? null;
}

export function fleetHref(locale: Locale, input: {
  query?: string;
  category?: string;
  minPassengers?: number | null;
  page?: number;
}) {
  const params = new URLSearchParams();
  const query = input.query?.trim() ?? "";
  if (query) params.set("q", query);
  if (input.category) params.set("category", input.category);
  if (input.minPassengers) params.set("passengers", String(input.minPassengers));
  if (input.page && input.page > 1) params.set("page", String(input.page));
  const search = params.toString();
  return search ? `/${locale}/fleet?${search}` : `/${locale}/fleet`;
}
