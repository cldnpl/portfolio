import type { Lang } from "@/lib/language";

export type PlatformKey = "visionos" | "android" | "ios";

export type HomeCopy = {
  nav: { work: string; about: string; contact: string; github: string };
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
  closing: { line: string; mail: string };
  footer: { left: string; right: string };
};

const en: HomeCopy = {
  nav: { work: "Work", about: "About", contact: "Contact", github: "GitHub" },
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
  closing: {
    line: "Tell me what it has to do. I will tell you how it should feel.",
    mail: "Start a conversation",
  },
  footer: { left: "© 2026 Claudia Napolitano", right: "Designed and built in Naples" },
};

const it: HomeCopy = {
  nav: { work: "Lavori", about: "Chi sono", contact: "Contatti", github: "GitHub" },
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
  closing: {
    line: "Dimmi cosa deve fare. Ti dirò come dovrebbe farti sentire.",
    mail: "Iniziamo a parlarne",
  },
  footer: { left: "© 2026 Claudia Napolitano", right: "Progettato e costruito a Napoli" },
};

export const homeCopy: Record<Lang, HomeCopy> = { en, it };

export const CONTACT_EMAIL = "claudia.napolitano@gmail.com";
export const GITHUB_URL = "https://github.com/cldnpl";
