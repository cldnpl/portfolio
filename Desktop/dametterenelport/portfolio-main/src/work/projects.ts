import type { Lang } from "@/lib/language";

export type Platform = "ios" | "android" | "visionos";

export type Shot = {
  /** Path under public/work, or null until a capture exists. */
  src: string | null;
  platform: Platform;
  /** What the screen shows — also the alt text, so it follows the reader. */
  caption: Record<Lang, string>;
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  platforms: Platform[];
  /**
   * A stamp on the card, only on work that was done for someone else and
   * shipped. Absent on personal work, which is most of this page.
   */
  badge?: Record<Lang, string>;
  /** One sentence, in the reader's language. */
  summary: Record<Lang, string>;
  /** On team work, the paragraph that says which part of it was mine. */
  contribution?: Record<Lang, string>;
  stack: string[];
  repo?: string;
  shots: Shot[];
};

/**
 * The order is the order on the page: work shipped for a client first, then
 * the projects with the widest platform reach, since that is what the
 * section is arguing.
 */
export const PROJECTS: Project[] = [
  {
    slug: "farnesina",
    name: "Viaggiare Sicuri",
    year: "2026",
    platforms: ["ios", "android"],
    badge: { en: "In production", it: "In produzione" },
    // Client, role and team are stated in the first sentence rather than in a
    // spec table: the cards are a subgrid sharing rows, so a register here
    // would push its own height into every other card on the same band.
    summary: {
      en: "Travel-safety app for the Farnesina — Italy's Ministry of Foreign Affairs and International Cooperation — public on iOS and Android. I work on it as a Mobile Developer, inside a professional mobile team.",
      it: "App per chi viaggia, per la Farnesina — il Ministero degli Affari Esteri e della Cooperazione Internazionale — pubblica su iOS e Android. Ci lavoro come Mobile Developer, dentro un team mobile professionale.",
    },
    contribution: {
      en: "My part, in a shared codebase: feature implementation, interface work, integration, bug fixing, and the maintenance a shipped app asks for.",
      it: "La mia parte, in un codebase condiviso: implementazione di funzionalità, interfaccia, integrazione, correzione di bug e la manutenzione che chiede un'app già pubblicata.",
    },
    stack: ["Swift", "UIKit", "Kotlin"],
    // Captures of the published app, off a real device — never a development
    // build. Both are iOS: the Android side is stated in the summary rather
    // than claimed by a screenshot that does not exist.
    shots: [
      { src: "work/farnesina-ios.jpg", platform: "ios", caption: { en: "Home", it: "Home" } },
      {
        src: "work/farnesina-country.jpg",
        platform: "ios",
        caption: { en: "Country file", it: "Scheda paese" },
      },
    ],
  },
  {
    slug: "banca-di-asti",
    name: "Banca di Asti Mobile",
    year: "2025 — 2026",
    platforms: ["ios", "android"],
    badge: { en: "Client project", it: "Progetto cliente" },
    summary: {
      en: "Mobile banking app for Banca di Asti, public on iOS and Android. Five months on a fixed-term contract at Venture Lab, as a Mobile Developer on both native codebases.",
      it: "App di mobile banking per la Banca di Asti, pubblica su iOS e Android. Cinque mesi con contratto a tempo determinato in Venture Lab, come Mobile Developer su entrambi i codebase nativi.",
    },
    contribution: {
      en: "September 2025 to February 2026, inside the team: feature implementation, interface work and bug fixing across the two native apps.",
      it: "Da settembre 2025 a febbraio 2026, dentro il team: implementazione di funzionalità, interfaccia e correzione di bug sulle due app native.",
    },
    stack: ["UIKit", "Kotlin"],
    // The app needs credentials to get past its own login, so these are not
    // captures of a running build: they are the two screens the bank publishes
    // itself, on its public setup guide, cropped down to the screen alone.
    // The data in them is the bank's own dummy data.
    shots: [
      { src: "work/asti-login.jpg", platform: "ios", caption: { en: "Sign in", it: "Accesso" } },
      { src: "work/asti-pin.jpg", platform: "ios", caption: { en: "PIN setup", it: "Creazione PIN" } },
    ],
  },
  {
    slug: "leyla",
    name: "Leyla",
    year: "2026",
    platforms: ["ios", "android"],
    summary: {
      en: "A private app for two, built long-distance first. Ambient presence — your partner one tap or one widget away. Written twice over a shared Go backend: SwiftUI with WidgetKit on iOS, Compose on Android.",
      it: "Un'app privata per due, pensata prima di tutto per la distanza. Presenza costante: il partner a un tocco o a un widget. Scritta due volte su un backend Go condiviso: SwiftUI con WidgetKit su iOS, Compose su Android.",
    },
    stack: ["Swift", "SwiftUI", "WidgetKit", "HealthKit", "MapKit", "Kotlin", "Jetpack Compose", "Health Connect", "Go", "PostgreSQL"],
    shots: [
      { src: "work/leyla-ios.jpg", platform: "ios", caption: { en: "Welcome", it: "Benvenuto" } },
      { src: "work/leyla-home.jpg", platform: "ios", caption: { en: "Home", it: "Home" } },
    ],
  },
  {
    slug: "livechess",
    name: "LiveChess",
    year: "2026",
    platforms: ["visionos"],
    summary: {
      en: "Chess as a table you walk around. A RealityKit board in an immersive space, a Stockfish engine behind it, and Lichess for playing someone who is not in the room.",
      it: "Gli scacchi come un tavolo attorno a cui girare. Una scacchiera RealityKit in uno spazio immersivo, il motore Stockfish dietro, e Lichess per giocare con chi non è nella stanza.",
    },
    stack: ["Swift", "SwiftUI", "visionOS", "RealityKit", "Immersive Space", "Stockfish", "Lichess API"],
    shots: [
      {
        src: "work/livechess-visionos.jpg",
        platform: "visionos",
        caption: { en: "Lobby, in the room", it: "Lobby, nella stanza" },
      },
      {
        src: "work/livechess-board.jpg",
        platform: "visionos",
        caption: { en: "A game in progress", it: "Una partita in corso" },
      },
    ],
  },
  {
    slug: "stikar",
    name: "StikAR",
    year: "2025",
    platforms: ["ios", "android"],
    summary: {
      en: "Spatial stickers anchored to real rooms, with a persistence layer so a scene survives the app closing. Written twice — RealityKit on iOS, ARCore on Android.",
      it: "Sticker spaziali ancorati a stanze reali, con un livello di persistenza che fa sopravvivere la scena alla chiusura dell'app. Scritta due volte: RealityKit su iOS, ARCore su Android.",
    },
    stack: ["Swift", "SwiftUI", "ARKit", "RealityKit", "Core Data", "Firebase", "Kotlin", "Jetpack Compose", "ARCore"],
    repo: "https://github.com/HoussamAW/AcademyGO",
    shots: [
      { src: "work/stikar-ios.jpg", platform: "ios", caption: { en: "Launch", it: "Avvio" } },
      { src: "work/stikar-ar.jpg", platform: "ios", caption: { en: "Stickers in a real room", it: "Sticker in una stanza vera" } },
    ],
  },
  {
    slug: "uzbelia",
    name: "Uzbelia",
    year: "2026",
    platforms: ["ios"],
    summary: {
      en: "Italian and Uzbek from A1 to B2, both directions over the same corpus: a path of levels, units and lessons with reading, writing, listening and speaking.",
      it: "Italiano e uzbeko dall'A1 al B2, in entrambe le direzioni sullo stesso corpus: un percorso di livelli, unità e lezioni con lettura, scrittura, ascolto e parlato.",
    },
    stack: ["Swift", "SwiftUI", "AVFoundation", "Speech", "XcodeGen"],
    shots: [{ src: "work/uzbelia-ios.jpg", platform: "ios", caption: { en: "Learning path", it: "Percorso di apprendimento" } }],
  },
  {
    slug: "tourism-accessible",
    name: "Tourism",
    year: "2025",
    platforms: ["ios"],
    summary: {
      en: "Built for a hackathon in Trieste. A map of the city's restaurants where every card can be read aloud — accessible tourism means the guide works when you cannot read the screen.",
      it: "Nata per un hackathon a Trieste. Una mappa dei ristoranti della città dove ogni scheda si fa leggere ad alta voce: turismo accessibile vuol dire che la guida funziona anche quando lo schermo non lo puoi leggere.",
    },
    stack: ["Swift", "SwiftUI", "MapKit", "AVSpeechSynthesizer", "CoreLocation"],
    shots: [{ src: "work/tourism-ios.jpg", platform: "ios", caption: { en: "Trieste restaurants", it: "Ristoranti a Trieste" } }],
  },
];
