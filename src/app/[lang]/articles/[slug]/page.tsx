import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { lang as langParam } from "next/root-params";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { getArticleBySlug, listArticles } from "@/lib/catalog";
import { getSiteForLocale, getSiteUrl, safeImagePosition } from "@/lib/content";
import { formatPublishedDate } from "@/lib/dates";
import { isLocale, localizeHref, pageAlternates } from "@/lib/i18n";
import { jsonLdScript } from "@/lib/seo";

export async function generateStaticParams() {
  const value = await langParam();
  if (!isLocale(value)) return [];
  return listArticles(value).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/articles/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const article = getArticleBySlug(lang, slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
    ...pageAlternates(getSiteUrl(), lang, `/articles/${article.slug}`),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default function ArticlePage({ params }: PageProps<"/[lang]/articles/[slug]">) {
  return (
    <Suspense fallback={<p className="px-5 pt-32 text-mist">…</p>}>
      <ArticleDetail params={params} />
    </Suspense>
  );
}

async function ArticleDetail({
  params,
}: Pick<PageProps<"/[lang]/articles/[slug]">, "params">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const article = getArticleBySlug(lang, slug);
  if (!article) notFound();

  const site = getSiteForLocale(lang);
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedOn,
    inLanguage: lang,
    ...(siteUrl
      ? {
          mainEntityOfPage: new URL(`/${lang}/articles/${article.slug}`, siteUrl).href,
          image: new URL(article.image, siteUrl).href,
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: site.companyName,
    },
  };

  return (
    <article className="pt-28 pb-16 lg:pt-32 lg:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Container>
        <Link
          href={localizeHref(lang, "/articles")}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:text-ivory"
        >
          {site.articlesPage.backLabel}
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          <time dateTime={article.publishedOn}>{formatPublishedDate(article.publishedOn, lang)}</time>
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,4.5vw,3.75rem)] font-medium leading-[0.98] tracking-[-0.04em] text-ivory">
          {article.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mist">{article.excerpt}</p>
        <div className="relative mt-8 aspect-[16/8] overflow-hidden rounded-2xl">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(min-width: 1024px) 90rem, 100vw"
            className="object-cover"
            style={{ objectPosition: safeImagePosition(article.imagePosition) }}
          />
        </div>
        <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-mist">
          {article.body.map((paragraph, index) => (
            <p key={`${article.slug}-${index}`}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </article>
  );
}
