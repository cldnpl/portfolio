import type { PhotoData } from "@/components/Photo";
import { localizedProjects, projects } from "@/data/projects";
import { type Lang, useLanguage } from "@/lib/language";

export const SITE_URL = "https://claudianapolitano.dev";

/**
 * Marble background: "full" behind the whole site, "hero" only behind the
 * first section (fading to white at About). MARBLE_OPACITY keeps it faint:
 * a white page where the marble only just shows through.
 */
export const MARBLE_MODE: "full" | "hero" = "full";
export const MARBLE_OPACITY = 0.2;

export type NavLinkItem = { title: string; href: string };

export const socials: NavLinkItem[] = [
  { title: "GitHub", href: "https://github.com/cldnpl" },
  { title: "LinkedIn", href: "https://www.linkedin.com/in/claudia-napolitano-1660b533a" },
];

export const headerData = {
  title: "Claudia Napolitano",
  links: [
    { title: "About", href: "#about" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ],
  socials,
};

export const footerData = {
  heading: "Get in touch",
  cta: "For enquiries, collaboration requests or job opportunities, don’t hesitate to reach out!",
  email: "napolitano.claudia@icloud.com",
  copyright: "Claudia Napolitano",
  credit: "Developed by Claudia Napolitano",
  socials,
};

export const heroData = {
  marquee: [
    {
      text: "Mobile developer",
      baseVelocity: -150,
      styles: { zIndex: 1, color: "white", mixBlendMode: "difference" as const },
    },
    { text: "Software engineer", baseVelocity: 150 },
    {
      text: "Creative",
      baseVelocity: -150,
      styles: { zIndex: 1, color: "white", mixBlendMode: "difference" as const },
    },
  ],
  availability: true,
  location: "based in naples",
  timeZone: "Europe/Rome",
  portrait: "/images/portrait.webp",
};

/** The strip of platform logos gliding under the hero. */
export const platformsData = {
  caption: "Native apps for every platform I build on",
  platforms: [
    { name: "iOS", logo: "/images/logos/ios.png", width: 355, height: 120 },
    { name: "Android", logo: "/images/logos/android.png", width: 751, height: 120 },
    { name: "Apple Vision Pro", logo: "/images/logos/vision-pro.png", width: 765, height: 120 },
    { name: "macOS", logo: "/images/logos/macos.png", width: 500, height: 120 },
    { name: "watchOS", logo: "/images/logos/watchos.png", width: 635, height: 120 },
  ],
};

export const aboutData = {
  heading: "About",
  photo: {
    src: "/images/about/academy.webp",
    alt: "Claudia with her class at the Apple Developer Academy in Naples",
    ratio: "1179/866",
    caption: "Apple Developer Academy, Naples",
  },
  content: [
    "I develop **native mobile apps** with a focus on **precision, motion and the people using them**, building interfaces where **every detail is intentional**.",
    "Based in Naples, I work at the intersection of **software and psychology**. **Three years at the Apple Developer Academy** in Naples: the **Foundation** programme in 2024, the **one-year Academy** from 2025 to 2026, and now **ARTE**, the advanced research programme on **augmented reality and Apple Vision Pro** development, from 2026 to 2027.",
    "In October 2025 I **won a hackathon in Naples**, building an app for **Crédit Agricole Italia**. From **SwiftUI to Compose to visionOS**, I take ideas from the first sketch **to the store** with meticulous attention to detail.",
  ],
};

export const featuredData = {
  projects,
  heading: "Featured Work",
  subHeading: "[Scroll to explore more]",
};

export type Service = {
  title: string;
  /** Under the tile in the dark panel. */
  label: string;
  image: string;
  video?: string;
  items: string[];
};

export const servicesData: {
  content: string;
  servicesIntro: string;
  /** The three hackathons, in order, all cut to the same ratio. */
  photos: PhotoData[];
  services: Service[];
} = {
  photos: [
    {
      src: "/images/about/hackathon.webp",
      alt: "Claudia holding the winner's banner of The Big Hack for Crédit Agricole, Naples 2025",
      ratio: "582/546",
      caption: "Winner, Naples, Oct 2025",
    },
    {
      src: "/images/about/trieste.webp",
      alt: "Claudia in Piazza Unità d'Italia during the hackathon in Trieste",
      ratio: "582/546",
      caption: "Trieste, Nov 2025",
    },
    {
      src: "/images/about/stockholm.webp",
      alt: "Teams at work at their tables during the hackathon in Stockholm",
      ratio: "582/546",
      caption: "Stockholm, Feb 2026",
    },
  ],
  content:
    "\"Most apps are built to be used; very few are built to be **understood**. I studied **psychology** for exactly that reason, and I write the **native code** myself, in Swift, in Kotlin and for visionOS, so nothing gets lost between **how people think** and what ends up on their screen. Every screen measured, every animation with a reason, every millisecond accounted for. If your product deserves to **feel obvious**, let's make sure it does.\"",
  servicesIntro:
    "I'm a developer who **taught herself Python and then Swift**, graduated in **Psychology with 110/110 cum laude** because interfaces are made for minds, and spent **three years at the Apple Developer Academy** in Naples, the last one on augmented reality and Vision Pro. Hackathons in Naples, Trieste and Stockholm, **the one in Naples won** for Crédit Agricole. **Six languages** spoken. I'm here to take an idea and bring it **natively to iOS, Android and visionOS** with the care it deserves. Software that respects the people using it, not just the specs it was written from.",
  // Each tile flies from its title into the dark panel. `video` (optional, a
  // short muted loop in public/videos) plays in place of the image.
  services: [
    {
      title: "iOS Apps",
      label: "Swift",
      image: "/images/services/ios.webp",
      items: ["Swift & SwiftUI", "UIKit", "WidgetKit", "HealthKit & MapKit"],
    },
    {
      title: "Android Apps",
      label: "Kotlin",
      image: "/images/services/android.webp",
      items: ["Kotlin", "Jetpack Compose", "Health Connect", "ARCore"],
    },
    {
      title: "visionOS",
      label: "visionOS",
      image: "/images/services/spatial.webp",
      items: ["Spatial computing", "RealityKit", "ARKit", "Immersive spaces"],
    },
    {
      title: "UX Psychology",
      label: "UX",
      image: "/images/services/ux.webp",
      items: ["User research", "Perception & attention", "Accessibility", "Usability testing"],
    },
  ],
};

/** One of these shows on the loader, picked at random by weight. */
export const loaderFacts = [
  { text: 'This loading screen actually serves no purpose it\'s for the "aesthetics"', weight: 10 },
  { text: "I speak six languages", weight: 2 },
  { text: "My mother taught me Spanish when I was three", weight: 1 },
  { text: "Python first, then Swift", weight: 2 },
  { text: "Forty-eight hours, one problem, no sleep", weight: 2 },
  { text: "Hackathon winner, Naples 2025", weight: 2 },
  { text: "110/110 cum laude in Psychology", weight: 1 },
  { text: "I wanted to take apart every Apple device I grew up with", weight: 1 },
  { text: "This portfolio is in a constant state of development", weight: 2 },
];

const description =
  "Claudia Napolitano is a mobile developer based in Naples, developing native apps for iOS, Android and visionOS with a focus on precision, motion, and the people using them.";

export const homeSeo = {
  title: "Claudia Napolitano | Mobile Developer",
  description,
  keywords:
    "Claudia Napolitano, Portfolio, Mobile Development, iOS, Android, visionOS, Swift, Kotlin, Mobile Developer",
  canonical: SITE_URL,
  image: `${SITE_URL}/images/portrait-og.jpg`,
};

/* ------------------------------------------------------------------ */
/* Italian. Same shapes as the English above; key concepts in **bold**. */

const headerIt: typeof headerData = {
  ...headerData,
  links: [
    { title: "Chi sono", href: "#about" },
    { title: "Progetti", href: "#projects" },
    { title: "Contatti", href: "#contact" },
  ],
};

const footerIt: typeof footerData = {
  ...footerData,
  heading: "Contattami",
  cta: "Per informazioni, collaborazioni o offerte di lavoro, non esitare a scrivermi!",
  credit: "Sviluppato da Claudia Napolitano",
};

// The three job titles stay in English, as on the Italian pages of the
// previous site: they are the titles used in Italy too.
const heroIt: typeof heroData = { ...heroData, location: "vivo a napoli" };

const platformsIt: typeof platformsData = {
  ...platformsData,
  caption: "App native per ogni piattaforma su cui sviluppo",
};

const aboutIt: typeof aboutData = {
  heading: "Chi sono",
  photo: {
    ...aboutData.photo,
    alt: "Claudia con la sua classe all'Apple Developer Academy di Napoli",
    caption: "Apple Developer Academy, Napoli",
  },
  content: [
    "Sviluppo **app mobile native** con un'attenzione particolare alla **precisione, al movimento e alle persone che le usano**, costruendo interfacce in cui **ogni dettaglio è intenzionale**.",
    "Vivo a Napoli e lavoro all'incrocio tra **software e psicologia**. **Tre anni all'Apple Developer Academy** di Napoli: il programma **Foundation** nel 2024, l'**Academy di un anno** dal 2025 al 2026 e ora **ARTE**, il programma di ricerca avanzata sulla **realtà aumentata e lo sviluppo per Apple Vision Pro**, dal 2026 al 2027.",
    "A ottobre 2025 ho **vinto un hackathon a Napoli** sviluppando un'app per **Crédit Agricole Italia**. Da **SwiftUI a Compose a visionOS**, porto le idee dal primo schizzo **fino allo store** con un'attenzione meticolosa ai dettagli.",
  ],
};

const servicesIt: typeof servicesData = {
  photos: [
    {
      ...servicesData.photos[0],
      alt: "Claudia con lo striscione da vincitrice di The Big Hack per Crédit Agricole, Napoli 2025",
      caption: "Vincitrice, Napoli, ott 2025",
    },
    {
      ...servicesData.photos[1],
      alt: "Claudia in piazza Unità d'Italia durante l'hackathon di Trieste",
      caption: "Trieste, nov 2025",
    },
    {
      ...servicesData.photos[2],
      alt: "I team al lavoro ai loro tavoli durante l'hackathon di Stoccolma",
      caption: "Stoccolma, feb 2026",
    },
  ],
  content:
    "\"La maggior parte delle app è fatta per essere usata; pochissime sono fatte per essere **capite**. Ho studiato **psicologia** proprio per questo, e il **codice nativo** lo scrivo io, in Swift, in Kotlin e per visionOS, così niente si perde tra **il modo in cui le persone pensano** e quello che finisce sul loro schermo. Ogni schermata misurata, ogni animazione con una ragione, ogni millisecondo messo in conto. Se il tuo prodotto merita di **sembrare ovvio**, facciamo in modo che lo sia.\"",
  servicesIntro:
    "Sono una sviluppatrice che ha **imparato da sola Python e poi Swift**, si è laureata in **Psicologia con 110/110 e lode** perché le interfacce sono fatte per le menti, e ha passato **tre anni all'Apple Developer Academy** di Napoli, l'ultimo sulla realtà aumentata e su Vision Pro. Hackathon a Napoli, Trieste e Stoccolma, **quello di Napoli vinto** per Crédit Agricole. **Sei lingue** parlate. Sono qui per prendere un'idea e portarla **in modo nativo su iOS, Android e visionOS** con la cura che merita. Software che rispetta le persone che lo usano, non solo le specifiche da cui è nato.",
  services: [
    { ...servicesData.services[0], title: "App iOS" },
    { ...servicesData.services[1], title: "App Android" },
    {
      ...servicesData.services[2],
      items: ["Spatial computing", "RealityKit", "ARKit", "Spazi immersivi"],
    },
    {
      ...servicesData.services[3],
      title: "Psicologia UX",
      items: ["Ricerca sugli utenti", "Percezione e attenzione", "Accessibilità", "Test di usabilità"],
    },
  ],
};

const loaderFactsIt: typeof loaderFacts = [
  { text: 'Questa schermata di caricamento non serve a niente, è solo per "l\'estetica"', weight: 10 },
  { text: "Parlo sei lingue", weight: 2 },
  { text: "Mia madre mi ha insegnato lo spagnolo a tre anni", weight: 1 },
  { text: "Prima Python, poi Swift", weight: 2 },
  { text: "Quarantotto ore, un problema, zero sonno", weight: 2 },
  { text: "Hackathon vinto, Napoli 2025", weight: 2 },
  { text: "110/110 e lode in Psicologia", weight: 1 },
  { text: "Volevo smontare ogni dispositivo Apple con cui sono cresciuta", weight: 1 },
  { text: "Questo portfolio è sempre in costruzione", weight: 2 },
];

const homeSeoIt: typeof homeSeo = {
  ...homeSeo,
  description:
    "Claudia Napolitano è una mobile developer di Napoli: sviluppa app native per iOS, Android e visionOS con attenzione alla precisione, al movimento e alle persone che le usano.",
  keywords:
    "Claudia Napolitano, Portfolio, Sviluppo mobile, iOS, Android, visionOS, Swift, Kotlin, Mobile Developer",
};

const content = {
  en: {
    header: headerData,
    footer: footerData,
    hero: heroData,
    platforms: platformsData,
    about: aboutData,
    featured: featuredData,
    services: servicesData,
    loaderFacts,
    seo: homeSeo,
  },
  it: {
    header: headerIt,
    footer: footerIt,
    hero: heroIt,
    platforms: platformsIt,
    about: aboutIt,
    featured: {
      projects: localizedProjects("it"),
      heading: "Progetti in evidenza",
      subHeading: "[Scorri per vederne altri]",
    },
    services: servicesIt,
    loaderFacts: loaderFactsIt,
    seo: homeSeoIt,
  },
};

export type SiteContent = (typeof content)["en"];

export const siteContent: Record<Lang, SiteContent> = content;

/** The copy in the language the visitor picked. */
export const useSite = () => siteContent[useLanguage().lang];
