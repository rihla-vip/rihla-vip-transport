import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header, SkipLink } from "@/components/header";
import { getSiteForLocale, getSiteUrl } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic",
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const site = getSiteForLocale(lang);
  const siteUrl = getSiteUrl();

  return {
    title: {
      default: site.seo.title,
      template: `%s — ${site.companyName}`,
    },
    description: site.seo.description,
    applicationName: site.companyName,
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    openGraph: {
      title: site.seo.title,
      description: site.seo.description,
      type: "website",
      locale: lang === "ar" ? "ar" : "en",
      siteName: site.companyName,
      ...(siteUrl
        ? {
            url: `${siteUrl}/${lang}`,
            images: [
              {
                url: site.seo.ogImage,
                alt: site.seo.ogImageAlt,
                width: 2000,
                height: 1239,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: site.seo.title,
      description: site.seo.description,
      ...(siteUrl ? { images: [site.seo.ogImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-navy font-sans text-ivory">
        <SkipLink />
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
