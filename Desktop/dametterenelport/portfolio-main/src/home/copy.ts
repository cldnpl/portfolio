import type { Lang } from "@/lib/language";

export type PlatformKey = "visionos" | "android" | "ios";

export type HomeCopy = {
  nav: { work: string; about: string; contact: string; github: string };
  /** Names for controls that show no text of their own. */
  a11y: { language: string; menu: string };
  role: string;
  hero: {
    metaLeft: string;
    metaRight: string;
    nameLines: string[];
    /** One line, and only one: the job title, set as a mark under the name. */
    tagline: string;
    cue: string;
  };
  stats: { value: string; label: string; gold?: boolean; suffix?: string }[];
  manifesto: {
    quote: string;
    items: { num: string; label: string; body: string }[];
  };
  stage: {
    kicker: string;
    chapters: {
      key: PlatformKey;
      index: string;
      title: string;
      subtitle: string;
      hint?: string;
    }[];
    loading: string;
    scroll: string;
  };
  phone: {
    eyebrow: string;
    title: string;
    items: string[];
    footer: string;
    /** Lock screen furniture, drawn onto the device displays. */
    lock: {
      ios: { date: string; time: string };
      android: { date: string; time: [string, string]; weather: string; caption: string };
    };
  };
  skills: { eyebrow: string; title: string };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sent: string;
    failed: string;
    fallback: string;
    location: string;
    locationValue: string;
  };
  footer: { left: string };
};

const en: HomeCopy = {
  nav: { work: "Projects", about: "About", contact: "Contact", github: "GitHub" },
  a11y: { language: "Language", menu: "Menu" },
  role: "Mobile Developer",
  hero: {
    metaLeft: "Portfolio — 2026",
    metaRight: "Naples, Italy",
    nameLines: ["Claudia", "Napolitano"],
    tagline: "Software Engineer & Mobile Architect",
    cue: "Scroll",
  },
  stats: [
    { value: "3", label: "Platforms shipped" },
    { value: "6", label: "Languages spoken" },
    { value: "1×", label: "Hackathon won — Naples" },
    { value: "110/110", suffix: "cum laude", label: "UX Psychology", gold: true },
  ],
  manifesto: {
    quote: "High-precision engineering for native ecosystems and spatial computing.",
    items: [
      {
        num: "01",
        label: "Discipline",
        body:
          "Native first. Every screen is measured on a grid, every animation has a reason, every millisecond of latency is accounted for.",
      },
      {
        num: "02",
        label: "Research",
        body:
          "Apple Developer Academy: the first year finished, the second one — ARTE — in progress. Advanced research and augmented reality engineering on Vision Pro.",
      },
      {
        num: "03",
        label: "Range",
        body:
          "One product, three platforms. The same intent expressed correctly in SwiftUI, in Compose, and in spatial interfaces.",
      },
    ],
  },
  stage: {
    kicker: "Three platforms",
    chapters: [
      { key: "visionos", index: "01", title: "visionOS", subtitle: "Spatial interfaces" },
      { key: "android", index: "02", title: "Android", subtitle: "Kotlin · Jetpack Compose" },
      {
        key: "ios",
        index: "03",
        title: "iOS",
        subtitle: "Swift · SwiftUI · UIKit — iOS, watchOS, macOS",
        hint: "Tap a button on the screen",
      },
    ],
    loading: "Preparing the devices",
    scroll: "Scroll",
  },
  phone: {
    eyebrow: "Claudia Napolitano",
    title: "Portfolio",
    items: ["Projects", "About me", "Contact"],
    footer: "Naples — Italy",
    lock: {
      ios: { date: "Saturday, 6 May", time: "10:18" },
      android: {
        date: "Sun, 28 Aug",
        time: ["06", "12"],
        weather: "28°",
        caption: "Naples — Italy",
      },
    },
  },
  skills: { eyebrow: "What I work with", title: "Capability" },
  contact: {
    eyebrow: "Contact",
    title: "Got an idea? Let's talk!",
    intro:
      "A project, a role, or a question about one of the apps above. Write here and it reaches me directly.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    message: "Message",
    messagePlaceholder: "What are you building?",
    send: "Send message",
    sending: "Sending",
    sent: "Sent. I will get back to you.",
    failed: "It did not go through.",
    fallback: "Write to me directly",
    location: "Based in",
    locationValue: "Naples, Italy",
  },
  footer: { left: "© 2026 Claudia Napolitano" },
};

const it: HomeCopy = {
  nav: { work: "Progetti", about: "Chi sono", contact: "Contatti", github: "GitHub" },
  a11y: { language: "Lingua", menu: "Menu" },
  role: "Mobile Developer",
  hero: {
    metaLeft: "Portfolio — 2026",
    metaRight: "Napoli, Italia",
    nameLines: ["Claudia", "Napolitano"],
    tagline: "Software Engineer & Mobile Architect",
    cue: "Scorri",
  },
  stats: [
    { value: "3", label: "Piattaforme pubblicate" },
    { value: "6", label: "Lingue parlate" },
    { value: "1×", label: "Hackathon vinto — Napoli" },
    { value: "110/110", suffix: "e lode", label: "UX Psychology", gold: true },
  ],
  manifesto: {
    quote: "Ingegneria di alta precisione per ecosistemi nativi e spatial computing.",
    items: [
      {
        num: "01",
        label: "Disciplina",
        body:
          "Nativo prima di tutto. Ogni schermata è misurata su una griglia, ogni animazione ha una ragione, ogni millisecondo di latenza è messo in conto.",
      },
      {
        num: "02",
        label: "Ricerca",
        body:
          "Apple Developer Academy: primo anno concluso, secondo — ARTE — in corso. Ricerca avanzata e programmazione di realtà aumentata su Vision Pro.",
      },
      {
        num: "03",
        label: "Ampiezza",
        body:
          "Un prodotto, tre piattaforme. La stessa intenzione espressa correttamente in SwiftUI, in Compose e nelle interfacce spaziali.",
      },
    ],
  },
  stage: {
    kicker: "Tre piattaforme",
    chapters: [
      { key: "visionos", index: "01", title: "visionOS", subtitle: "Interfacce spaziali" },
      { key: "android", index: "02", title: "Android", subtitle: "Kotlin · Jetpack Compose" },
      {
        key: "ios",
        index: "03",
        title: "iOS",
        subtitle: "Swift · SwiftUI · UIKit — iOS, watchOS, macOS",
        hint: "Tocca un pulsante sullo schermo",
      },
    ],
    loading: "Preparo i dispositivi",
    scroll: "Scorri",
  },
  phone: {
    eyebrow: "Claudia Napolitano",
    title: "Portfolio",
    items: ["Progetti", "Chi sono", "Contatti"],
    footer: "Napoli — Italia",
    lock: {
      ios: { date: "sabato 6 maggio", time: "10:18" },
      android: {
        date: "dom 28 ago",
        time: ["06", "12"],
        weather: "28°",
        caption: "Napoli — Italia",
      },
    },
  },
  skills: { eyebrow: "Con cosa lavoro", title: "Competenze" },
  contact: {
    eyebrow: "Contatti",
    title: "Hai qualche idea? Parliamone!",
    intro:
      "Un progetto, una posizione, o una domanda su una delle app qui sopra. Scrivi qui e arriva direttamente a me.",
    name: "Nome",
    namePlaceholder: "Il tuo nome",
    email: "Email",
    emailPlaceholder: "tu@esempio.com",
    message: "Messaggio",
    messagePlaceholder: "Cosa stai costruendo?",
    send: "Invia messaggio",
    sending: "Invio in corso",
    sent: "Inviato. Ti rispondo presto.",
    failed: "Non è partito.",
    fallback: "Scrivimi direttamente",
    location: "Lavoro da",
    locationValue: "Napoli, Italia",
  },
  footer: { left: "© 2026 Claudia Napolitano" },
};

export const homeCopy: Record<Lang, HomeCopy> = { en, it };

export const CONTACT_EMAIL = "napolitano.claudia@icloud.com";
export const GITHUB_URL = "https://github.com/cldnpl";
export const LINKEDIN_URL = "https://www.linkedin.com/in/claudia-napolitano-1660b533a";
