import type { SiteContent } from "@/lib/types";

export function organizationJsonLd(site: SiteContent, siteUrl: string | null) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.companyName,
    description: site.description,
  };

  if (siteUrl) data.url = siteUrl;
  if (site.email) data.email = site.email;
  const telephones = [
    ...(site.phone ? [site.phone] : []),
    ...site.contacts.map((contact) => contact.phone.replace(/\s/g, "")),
  ];
  if (telephones.length === 1) data.telephone = telephones[0];
  if (telephones.length > 1) data.telephone = telephones;
  if (site.logo && siteUrl) data.logo = new URL(site.logo, siteUrl).href;

  const sameAs = site.socialLinks
    .map((link) => link.href)
    .filter((href) => href.startsWith("http"));
  if (sameAs.length > 0) data.sameAs = sameAs;

  return data;
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
