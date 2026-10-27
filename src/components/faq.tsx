import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { getFaqsForLocale, getSiteForLocale } from "@/lib/content";
import { getLocale } from "@/lib/locale";

export async function Faq() {
  const locale = await getLocale();
  const site = getSiteForLocale(locale);
  const faqs = getFaqsForLocale(locale);

  return (
    <section id={site.faqSection.id} className="pb-16 lg:pb-24" aria-labelledby="faq-title">
      <Container>
        <SectionHeading
          id="faq-title"
          eyebrow={site.faqSection.eyebrow}
          title={site.faqSection.title}
        />
        {faqs.length === 0 ? (
          <p className="mt-10 text-mist">{site.faqSection.empty}</p>
        ) : (
          <div className="mt-10 border-t border-ivory/10">
            {faqs.map((faq) => (
              <details key={faq.id} name="faq" className="group border-b border-ivory/10">
                <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 text-left text-lg font-medium tracking-[-0.02em] text-ivory">
                  <span>{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-xl leading-none text-gold motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 text-pretty leading-relaxed text-mist">{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
