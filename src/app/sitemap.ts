import type { MetadataRoute } from "next";
import { listArticles } from "@/lib/catalog";
import { getSiteForLocale, getSiteUrl, getVehiclesForLocale } from "@/lib/content";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const pages: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const updated = getSiteForLocale(locale).contentUpdated;
    pages.push(
      { url: `${siteUrl}/${locale}`, lastModified: updated, changeFrequency: "monthly", priority: 1 },
      {
        url: `${siteUrl}/${locale}/fleet`,
        lastModified: updated,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${siteUrl}/${locale}/articles`,
        lastModified: updated,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    );
    for (const vehicle of getVehiclesForLocale(locale)) {
      pages.push({
        url: `${siteUrl}/${locale}/fleet/${vehicle.id}`,
        lastModified: updated,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
    for (const article of listArticles(locale)) {
      pages.push({
        url: `${siteUrl}/${locale}/articles/${article.slug}`,
        lastModified: article.publishedOn,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return pages;
}
