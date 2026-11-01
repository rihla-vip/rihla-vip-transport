import fs from "node:fs";
import path from "node:path";
import enSite from "@/data/en/site.json";
import arSite from "@/data/ar/site.json";
import enVehicles from "@/data/en/vehicles.json";
import arVehicles from "@/data/ar/vehicles.json";
import enFaqs from "@/data/en/faqs.json";
import arFaqs from "@/data/ar/faqs.json";
import enArticles from "@/data/en/articles.json";
import arArticles from "@/data/ar/articles.json";
import serviceData from "@/data/services.json";
import routeData from "@/data/routes.json";
import type { Locale } from "@/lib/i18n";
import type { Article, Faq, Route, Service, SiteContent, Vehicle } from "@/lib/types";
import { isWhatsappConfigured } from "@/lib/whatsapp";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const SAFE_POSITION =
  /^(?:[a-z]+|\d{1,3}%)(?:\s+(?:[a-z]+|\d{1,3}%))?$/i;

export function safeImagePosition(value: string | undefined): string {
  if (!value || !SAFE_POSITION.test(value.trim())) return "center";
  return value.trim();
}

function assertPublicImage(src: string, label: string) {
  assert(
    src.startsWith("/") && !src.includes(".."),
    `${label} must be a public path starting with /.`,
  );
  const file = path.join(process.cwd(), "public", src);
  assert(fs.existsSync(file), `${label} was not found at public${src}.`);
}

function assertUniqueIds(ids: string[], file: string) {
  const seen = new Set<string>();
  for (const id of ids) {
    assert(id.trim().length > 0, `${file} contains an empty id.`);
    assert(!seen.has(id), `${file} contains a duplicate id: ${id}.`);
    seen.add(id);
  }
}

function isInternalHref(href: string) {
  if (href.startsWith("#")) return href.length > 1;
  if (!href.startsWith("/") || href.startsWith("//") || href.includes("..")) return false;
  return /^\/(?:#[A-Za-z0-9-]+|[A-Za-z0-9/_-]*)$/.test(href);
}

function assertNav(links: SiteContent["navigation"], label: string) {
  for (const link of links) {
    assert(link.label.trim().length > 0, `${label} has a link without a label.`);
    assert(
      isInternalHref(link.href),
      `${label} href "${link.href}" must be a section anchor or an on-site path.`,
    );
  }
}

function loadSite(site: SiteContent, file: string): SiteContent {
  assert(site.companyName.trim().length > 0, `companyName is required in ${file}.`);
  assert(site.locale.trim().length > 0, "locale is required in site.json.");
  assert(
    site.whatsappNumber === "" || isWhatsappConfigured(site.whatsappNumber),
    `whatsappNumber in ${file} must be 8 to 15 digits with no spaces or symbols, or an empty string.`,
  );
  assert(Array.isArray(site.contacts), `contacts in ${file} must be an array.`);
  for (const contact of site.contacts) {
    assert(contact.name.trim().length > 0, `A contact in ${file} needs a name.`);
    assert(
      /^\+\d[\d\s-]{7,18}$/.test(contact.phone.trim()),
      `Contact "${contact.name}" in ${file} needs a phone number such as +966 50 947 0674.`,
    );
  }
  if (site.logo) assertPublicImage(site.logo, "logo");
  assertPublicImage(site.hero.image, "Hero image");
  assertPublicImage(site.destinations.image, "Destinations image");
  assertPublicImage(site.seo.ogImage, "Open Graph image");
  assertNav(site.navigation, `${file} navigation`);
  assertNav(site.footerNavigation, `${file} footerNavigation`);
  if (site.siteUrl) {
    let parsed: URL;
    try {
      parsed = new URL(site.siteUrl);
    } catch {
      throw new Error(`siteUrl in ${file} must be an absolute http(s) URL, or empty.`);
    }
    assert(
      parsed.protocol === "http:" || parsed.protocol === "https:",
      `siteUrl in ${file} must start with http:// or https://.`,
    );
  }
  for (const link of site.socialLinks) {
    assert(
      /^https?:\/\//.test(link.href),
      `Social link "${link.label}" must be an http(s) URL.`,
    );
  }
  return site;
}

function loadVehicles(vehicles: Vehicle[], file: string): Vehicle[] {
  assert(Array.isArray(vehicles), `${file} must be an array.`);
  assertUniqueIds(
    vehicles.map((vehicle) => vehicle.id),
    file,
  );
  for (const vehicle of vehicles) {
    assert(vehicle.name.trim().length > 0, `Vehicle ${vehicle.id} needs a name.`);
    assert(
      Number.isInteger(vehicle.passengers) && vehicle.passengers > 0,
      `Vehicle ${vehicle.id} needs a passenger capacity greater than 0.`,
    );
    assert(
      Number.isInteger(vehicle.luggage) && vehicle.luggage >= 0,
      `Vehicle ${vehicle.id} needs a luggage capacity of 0 or more.`,
    );
    assert(Array.isArray(vehicle.features), `Vehicle ${vehicle.id} features must be an array.`);
    assert(vehicle.imageAlt.trim().length > 0, `Vehicle ${vehicle.id} needs image alt text.`);
    assertPublicImage(vehicle.image, `Vehicle ${vehicle.id} image`);
    for (const image of vehicle.gallery) {
      assertPublicImage(image, `Vehicle ${vehicle.id} gallery image`);
    }
    assert(
      vehicle.price === null || vehicle.price.trim().length > 0,
      `Vehicle ${vehicle.id} price must be a non-empty string or null. Do not invent a fare.`,
    );
  }
  return [...vehicles].sort((a, b) => a.order - b.order);
}

function loadServices(): Service[] {
  const services = serviceData as Service[];
  assert(Array.isArray(services), "services.json must be an array.");
  assertUniqueIds(
    services.map((service) => service.id),
    "services.json",
  );
  for (const service of services) {
    assert(service.name.trim().length > 0, `Service ${service.id} needs a name.`);
    assert(
      service.description.trim().length > 0,
      `Service ${service.id} needs a description.`,
    );
  }
  return [...services].sort((a, b) => a.order - b.order);
}

function loadRoutes(): Route[] {
  const routes = routeData as Route[];
  assert(Array.isArray(routes), "routes.json must be an array.");
  assertUniqueIds(
    routes.map((route) => route.id),
    "routes.json",
  );
  for (const route of routes) {
    assert(route.origin.trim().length > 0, `Route ${route.id} needs an origin.`);
    assert(
      route.destination.trim().length > 0,
      `Route ${route.id} needs a destination.`,
    );
    assert(
      route.duration === null || route.duration.trim().length > 0,
      `Route ${route.id} duration must be a verified estimate or null.`,
    );
  }
  return [...routes].sort((a, b) => a.order - b.order);
}

function loadFaqs(faqs: Faq[], file: string): Faq[] {
  assert(Array.isArray(faqs), `${file} must be an array.`);
  assertUniqueIds(
    faqs.map((faq) => faq.id),
    file,
  );
  for (const faq of faqs) {
    assert(faq.question.trim().length > 0, `FAQ ${faq.id} needs a question.`);
    assert(faq.answer.trim().length > 0, `FAQ ${faq.id} needs an answer.`);
  }
  return [...faqs].sort((a, b) => a.order - b.order);
}

const siteByLocale = {
  en: loadSite(enSite as SiteContent, "en/site.json"),
  ar: loadSite(arSite as SiteContent, "ar/site.json"),
} satisfies Record<Locale, SiteContent>;

const vehiclesByLocale = {
  en: loadVehicles(enVehicles as Vehicle[], "en/vehicles.json"),
  ar: loadVehicles(arVehicles as Vehicle[], "ar/vehicles.json"),
} satisfies Record<Locale, Vehicle[]>;

const faqsByLocale = {
  en: loadFaqs(enFaqs as Faq[], "en/faqs.json"),
  ar: loadFaqs(arFaqs as Faq[], "ar/faqs.json"),
} satisfies Record<Locale, Faq[]>;

export function getServices(): Service[] {
  return loadServices();
}

export function getRoutes(): Route[] {
  return loadRoutes();
}

function sameIds(left: string[], right: string[], file: string) {
  assert(
    left.join("\n") === right.join("\n"),
    `${file} must list the same ids in the same order in English and Arabic.`,
  );
}

sameIds(
  vehiclesByLocale.en.map((vehicle) => vehicle.id),
  vehiclesByLocale.ar.map((vehicle) => vehicle.id),
  "vehicles.json",
);
sameIds(
  faqsByLocale.en.map((faq) => faq.id),
  faqsByLocale.ar.map((faq) => faq.id),
  "faqs.json",
);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PUBLISHED_ON = /^\d{4}-\d{2}-\d{2}$/;

function loadArticles(articles: Article[], file: string): Article[] {
  assert(Array.isArray(articles), `${file} must be an array.`);
  assertUniqueIds(
    articles.map((article) => article.slug),
    file,
  );
  for (const article of articles) {
    assert(SLUG.test(article.slug), `Article slug "${article.slug}" must use lowercase words and hyphens.`);
    assert(article.title.trim().length > 0, `Article ${article.slug} needs a title.`);
    assert(article.excerpt.trim().length > 0, `Article ${article.slug} needs an excerpt.`);
    assert(
      Array.isArray(article.body) && article.body.every((paragraph) => paragraph.trim().length > 0),
      `Article ${article.slug} needs at least one paragraph.`,
    );
    assert(
      PUBLISHED_ON.test(article.publishedOn),
      `Article ${article.slug} publishedOn must be YYYY-MM-DD.`,
    );
    assert(article.imageAlt.trim().length > 0, `Article ${article.slug} needs image alt text.`);
    assertPublicImage(article.image, `Article ${article.slug} image`);
  }
  return [...articles].sort((a, b) => a.order - b.order);
}

const articlesByLocale = {
  en: loadArticles(enArticles as Article[], "en/articles.json"),
  ar: loadArticles(arArticles as Article[], "ar/articles.json"),
} satisfies Record<Locale, Article[]>;

sameIds(
  articlesByLocale.en.map((article) => article.slug),
  articlesByLocale.ar.map((article) => article.slug),
  "articles.json",
);

export function getSiteForLocale(locale: Locale): SiteContent {
  return siteByLocale[locale];
}

export function getVehiclesForLocale(locale: Locale): Vehicle[] {
  return vehiclesByLocale[locale];
}

export function getFaqsForLocale(locale: Locale): Faq[] {
  return faqsByLocale[locale];
}

export function getArticlesForLocale(locale: Locale): Article[] {
  return articlesByLocale[locale];
}

export function getSiteUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  const candidate = (fromEnv || siteByLocale.en.siteUrl).trim().replace(/\/$/, "");
  if (!candidate) return null;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL such as https://example.com.",
    );
  }
  assert(
    url.protocol === "http:" || url.protocol === "https:",
    "NEXT_PUBLIC_SITE_URL must start with http:// or https://.",
  );
  const pathName = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
  return `${url.origin}${pathName}`;
}

export function splitFleet(vehicles: Vehicle[]): {
  featured: Vehicle | null;
  rest: Vehicle[];
} {
  if (vehicles.length === 0) return { featured: null, rest: [] };
  const featuredIndex = vehicles.findIndex((vehicle) => vehicle.featured);
  const index = featuredIndex === -1 ? 0 : featuredIndex;
  return {
    featured: vehicles[index],
    rest: vehicles.filter((_, itemIndex) => itemIndex !== index),
  };
}
