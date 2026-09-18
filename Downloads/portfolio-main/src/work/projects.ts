import type { Lang } from "@/lib/language";

export type Platform = "ios" | "android" | "visionos";

export type Shot = {
  /** Path under public/work, or null until a capture exists. */
  src: string | null;
  platform: Platform;
  /** What the screen shows — also the alt text. */
  caption: string;
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  platforms: Platform[];
  /** One sentence, in the reader's language. */
  summary: Record<Lang, string>;
  stack: string[];
  repo?: string;
  shots: Shot[];
};

/**
 * The order is the order on the page: the projects with the widest platform
 * reach first, since that is what the section is arguing.
 */
export const PROJECTS: Project[] = [
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
      { src: "work/leyla-ios.jpg", platform: "ios", caption: "Welcome" },
      { src: "work/leyla-home.jpg", platform: "ios", caption: "Home" },
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
    shots: [{ src: "work/livechess-visionos.jpg", platform: "visionos", caption: "Lobby, in the room" }],
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
      { src: "work/stikar-ios.jpg", platform: "ios", caption: "Launch" },
      { src: "work/stikar-ar.jpg", platform: "ios", caption: "Stickers in a real room" },
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
    shots: [{ src: "work/uzbelia-ios.jpg", platform: "ios", caption: "Learning path" }],
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
    shots: [{ src: "work/tourism-ios.jpg", platform: "ios", caption: "Trieste restaurants" }],
  },
];
