import Link from "next/link";
import { Container } from "@/components/container";
import { getSiteForLocale } from "@/lib/content";
import { localizeHref } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function NotFound() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);

  return (
    <section className="pt-32 pb-24">
      <Container>
        <h1 className="text-4xl font-medium tracking-[-0.04em] text-ivory">{site.ui.notFoundTitle}</h1>
        <p className="mt-4 max-w-md text-mist">{site.ui.notFoundText}</p>
        <Link
          href={localizeHref(locale, "/")}
          className="mt-6 inline-flex text-sm font-semibold text-gold hover:text-ivory"
        >
          {site.ui.notFoundHome}
        </Link>
      </Container>
    </section>
  );
}
