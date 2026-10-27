import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { safeImagePosition } from "@/lib/content";
import { formatPublishedDate } from "@/lib/dates";
import { localizeHref, type Locale } from "@/lib/i18n";
import type { Article } from "@/lib/types";

export function ArticleCard({
  article,
  readLabel,
  locale,
}: {
  article: Article;
  readLabel: string;
  locale: Locale;
}) {
  return (
    <article className="overflow-hidden rounded-2xl bg-surface">
      <Link href={localizeHref(locale, `/articles/${article.slug}`)} className="group block">
        <div className="relative aspect-[16/10]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: safeImagePosition(article.imagePosition) }}
          />
        </div>
        <div className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            <time dateTime={article.publishedOn}>{formatPublishedDate(article.publishedOn, locale)}</time>
          </p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-ivory">{article.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mist">{article.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors group-hover:text-ivory">
            {readLabel}
            <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </article>
  );
}
