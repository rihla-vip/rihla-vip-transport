# Rihla

A marketing site for a private transfer company. Visitors browse featured vehicles and articles, open the full fleet to search and filter, then continue the conversation on WhatsApp. There is no booking engine, account system, or payment flow. Vehicle and article lists are JSON for now. `src/lib/catalog.ts` is the place to connect a database later.

The company name **Rihla**, the fleet, services, routes, and contact details shipped with this project are placeholders. Replace them before launch.

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push the project to a Git repository.
2. Import the repository in Vercel. The framework preset is Next.js.
3. Leave the build command as `npm run build` and the output as the Next.js default.
4. Set `NEXT_PUBLIC_SITE_URL` to the public site origin, for example `https://example.com`, then redeploy.

No database or server secrets are required yet. Lists are read from JSON through `src/lib/catalog.ts`. Image optimization is handled by Next.js.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Public origin used for the canonical URL, sitemap, robots entry, and social preview image. If it is empty, `siteUrl` in `src/data/en/site.json` is used. Leave both empty until the domain is known. |

Do not commit a `.env` file with private values. This project does not need any private keys.

## Where content lives

Editable copy and business details live in JSON, not in React components.

| File | What it controls |
| --- | --- |
| `src/data/en/` and `src/data/ar/` | English and Arabic copies of the site, fleet, articles, and questions |
| `src/data/services.json` | Services list |
| `src/data/routes.json` | Example or real journeys |
| `src/data/en/faqs.json` and `src/data/ar/faqs.json` | Questions and answers |

TypeScript checks these files when the site builds. A missing image, a duplicate id, or a badly formatted WhatsApp number fails the build with a message that names the field.

`locale` is included so a later translation can replace these files without redesigning the page. There is no translation framework in the project.

### Change the company name

In `src/data/en/site.json` and `src/data/ar/site.json`, set `companyName` and update `seo.title` and `seo.description`. Set `companyNameIsPlaceholder` to `false` once the real name is in place. The header uses `companyName` as a wordmark until `logo` points at an image in `public/`. English lives at `/en` and Arabic at `/ar`. The logo returns to that language’s homepage. The header switches language and keeps the current page.

### Change the WhatsApp number

Set `whatsappNumber` to digits only, in international format, with no `+`, spaces, or dashes. Example: `212600112233`.

An empty string keeps every inquiry control from opening a broken `wa.me` link. Header, hero, vehicle, and footer buttons then send people to the footer, which explains that the number is not published yet.

Messages are edited in `messages`:

- `general` is used by the header, hero, and footer.
- `vehicle` may include `{vehicle}`.
- `route` may include `{origin}` and `{destination}`.

Links are built as `https://wa.me/<number>?text=<encoded message>` and open in a new tab.

### Update vehicles

Each object in `src/data/en/vehicles.json` and `src/data/ar/vehicles.json` supports the same ids:

- `id`, `name`, `category`, `description`
- `passengers`, `luggage`
- `features` (short list)
- `image`, `imageAlt`, `imagePosition`
- `gallery` (stored for later; the page does not render a gallery)
- `order`, `featured`
- `price` (`null` unless the company supplies an indicative price string, shown as written)
- `suitability`

The homepage shows up to three vehicles, with featured ones first. `/fleet` lists the full set with search, category, passenger filters, and pagination. Do not invent fares. Leave `price` as `null` until a real indicative price is provided.

Remove a vehicle by deleting its object. Add one by copying an existing object and giving it a new `id`. The fleet page shows six vehicles per page.

### Update articles

Each object in `src/data/en/articles.json` and `src/data/ar/articles.json` supports `slug`, `title`, `excerpt`, `body` (paragraphs), `image`, `imageAlt`, `imagePosition`, `publishedOn` (`YYYY-MM-DD`), `order`, and `featured`. Use the same slug in both languages.

The homepage shows up to three articles, featured first. Each card opens `/articles/<slug>`. `/articles` lists all of them. Slugs use lowercase words and hyphens.

### Update images

Put files in `public/images/` and point the JSON `image` fields at them, for example `/images/sedan.jpg`.

Use landscape photographs, roughly 1600–2000 pixels wide. Write an `imageAlt` that describes the picture. Hero art uses `preload`; other images load lazily.

These files are temporary stock photographs and must be replaced with the real fleet before launch:

| File | Used for | Source |
| --- | --- | --- |
| `public/images/hero.jpg` | Hero | [Ilya Godze on Unsplash](https://unsplash.com/photos/a-black-mercedes-benz-s-class-sedan-driving-on-road--J3tzK3FPxQ) |
| `public/images/sedan.jpg` | Executive sedan | [Ilya Godze on Unsplash](https://unsplash.com/photos/a-black-luxury-sedan-parked-on-the-roadside-vp9A1TJ9KoY) |
| `public/images/suv.jpg` | Premium SUV | Unsplash photo `photo-1617531653332-bd46c24f2068` |
| `public/images/van.jpg` | Executive van | [William G on Unsplash](https://unsplash.com/photos/a-dark-mercedes-van-with-its-headlights-on-PNW4oeltJGo) |
| `public/images/journey.jpg` | Destinations | Unsplash photo `photo-1449965408869-eaa3f722e40d` |

Unsplash License applies to these placeholders. They do not depict the company fleet.

`src/app/icon.svg` is a temporary mark, not a logo.

### Update services, routes, and questions

Edit `src/data/services.json`, `src/data/routes.json`, and the `faqs.json` file in each language folder.

The services and routes in the repository are examples. Delete any journey the company does not offer. Leave `duration` as `null` until a travel time has been verified. Do not add fares to routes.

An empty list hides the cards and shows the matching empty sentence from `site.json`. Navigation anchors still land on the section.

### Contact details

`phone`, `email`, `businessHours`, `serviceAreas`, and `socialLinks` are omitted from the page when empty. Do not add an address, rating, or opening hours that the company has not supplied. Structured data stays a simple Organization record and only includes a URL, telephone, email, logo, or social profile when that value exists.

Set `siteUrl` or `NEXT_PUBLIC_SITE_URL` when the domain is known so the canonical link, sitemap, and social image resolve.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```
