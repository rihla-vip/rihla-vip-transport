import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { featuredArticles, listArticles } from "@/lib/catalog";
import { getSiteForLocale } from "@/lib/content";
import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function Articles() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const articles = featuredArticles(locale, 3);
  const hasMore = listArticles(locale).length > articles.length;
  const lines = site.articlesSection.title.split("\n").filter((line) => line.length > 0);

  return (
    <section id={site.articlesSection.id} className="pb-16 lg:pb-24" aria-labelledby="articles-title">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              — {site.articlesSection.eyebrow}
            </p>
            <h2
              id="articles-title"
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
            <p className="text-sm leading-relaxed text-mist">{site.articlesSection.intro}</p>
            {hasMore ? (
              <Link
                href={localizeHref(locale, "/articles")}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-ivory"
              >
                {site.articlesSection.allLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
              </Link>
            ) : null}
          </div>
        </div>
        {articles.length === 0 ? (
          <p className="mt-10 text-mist">{site.articlesSection.empty}</p>
        ) : (
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard article={article} readLabel={site.articlesSection.readLabel} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
