import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { Container } from "@/components/container";
import { listArticles } from "@/lib/catalog";
import { getSiteForLocale, getSiteUrl } from "@/lib/content";
import { isLocale, pageAlternates } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/articles">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const site = getSiteForLocale(lang);
  return {
    title: site.articlesPage.title,
    description: site.articlesPage.intro,
    ...pageAlternates(getSiteUrl(), lang, "/articles"),
  };
}

export default async function ArticlesPage({ params }: PageProps<"/[lang]/articles">) {
  const { lang } = await params;
  if (!isLocale(lang)) return null;
  const site = getSiteForLocale(lang);
  const articles = listArticles(lang);

  return (
    <section className="pt-28 pb-16 lg:pt-32 lg:pb-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          — {site.articlesPage.eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(2.4rem,4.5vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.04em] text-ivory">
          {site.articlesPage.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist">{site.articlesPage.intro}</p>
        {articles.length === 0 ? (
          <p className="mt-10 text-mist">{site.articlesPage.empty}</p>
        ) : (
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.slug}>
                <ArticleCard
                  article={article}
                  readLabel={site.articlesSection.readLabel}
                  locale={lang}
                />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
