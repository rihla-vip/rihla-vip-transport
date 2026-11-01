export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type PhoneContact = {
  name: string;
  phone: string;
};

export type Highlight = {
  title: string;
  text: string;
};

export type WhyPoint = {
  title: string;
  text: string;
};

export type ProcessStep = {
  title: string;
  text: string;
};

export type SiteContent = {
  locale: string;
  companyName: string;
  companyNameIsPlaceholder: boolean;
  tagline: string;
  description: string;
  whatsappNumber: string;
  phone: string;
  contacts: PhoneContact[];
  email: string;
  logo: string;
  siteUrl: string;
  contentUpdated: string;
  serviceAreas: string[];
  businessHours: string;
  socialLinks: SocialLink[];
  copyrightYear: string;
  navigation: NavLink[];
  footerNavigation: NavLink[];
  hero: {
    eyebrow: string;
    headline: string;
    supporting: string;
    primaryCta: string;
    secondaryCta: string;
    secondaryHref: string;
    image: string;
    imageAlt: string;
    imagePosition: string;
  };
  highlightsLabel: string;
  highlights: Highlight[];
  fleet: {
    id: string;
    eyebrow: string;
    title: string;
    intro: string;
    empty: string;
    passengersLabel: string;
    luggageLabel: string;
    capacityValue: string;
    inquireLabel: string;
    priceLabel: string;
    viewAllLabel: string;
    viewAllHref: string;
  };
  vehiclePage: {
    backLabel: string;
  };
  fleetPage: {
    eyebrow: string;
    title: string;
    intro: string;
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    allCategories: string;
    passengersLabel: string;
    anyPassengers: string;
    passengersOption: string;
    applyLabel: string;
    clearLabel: string;
    empty: string;
    resultSingular: string;
    resultPlural: string;
    previousLabel: string;
    nextLabel: string;
    pageLabel: string;
    paginationLabel: string;
  };
  articlesSection: {
    id: string;
    eyebrow: string;
    title: string;
    intro: string;
    empty: string;
    readLabel: string;
    allLabel: string;
  };
  articlesPage: {
    eyebrow: string;
    title: string;
    intro: string;
    empty: string;
    backLabel: string;
  };
  servicesSection: {
    id: string;
    eyebrow: string;
    title: string;
    intro: string;
    empty: string;
  };
  destinations: {
    id: string;
    eyebrow: string;
    title: string;
    intro: string;
    empty: string;
    image: string;
    imageAlt: string;
    imagePosition: string;
    inquireLabel: string;
  };
  why: {
    id: string;
    eyebrow: string;
    title: string;
    points: WhyPoint[];
  };
  process: {
    id: string;
    eyebrow: string;
    title: string;
    steps: ProcessStep[];
    note: string;
  };
  faqSection: {
    id: string;
    eyebrow: string;
    title: string;
    empty: string;
  };
  contact: {
    id: string;
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
    aside: string;
    pendingNote: string;
    reassurance: string;
    phoneLabel: string;
    emailLabel: string;
    hoursLabel: string;
    areasLabel: string;
    socialLabel: string;
  };
  footer: {
    blurb: string;
    rights: string;
    inquiryLabel: string;
    exploreLabel: string;
  };
  ui: {
    headerCta: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    mobileNavLabel: string;
    primaryNavLabel: string;
    footerNavLabel: string;
    whatsappUnavailable: string;
    mobileCta: string;
    languageLabel: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundHome: string;
    loadingVehicles: string;
    loadingArticle: string;
  };
  messages: {
    general: string;
    vehicle: string;
    route: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
    ogImageAlt: string;
  };
};

export type Vehicle = {
  id: string;
  name: string;
  category: string;
  description: string;
  passengers: number;
  luggage: number;
  features: string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
  gallery: string[];
  order: number;
  featured: boolean;
  price: string | null;
  suitability: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  order: number;
};

export type Route = {
  id: string;
  origin: string;
  destination: string;
  description: string;
  duration: string | null;
  order: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
  imageAlt: string;
  imagePosition: string;
  publishedOn: string;
  order: number;
  featured: boolean;
};
