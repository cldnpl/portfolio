export type GalleryItem = { src: string; ratio: string; alt?: string };
export type GalleryRow = { items: GalleryItem[] };
export type OverviewItem = { label: string; text: string };

export type Project = {
  title: string;
  coverImage: string;
  /** One phone, 4:5: used where the layout is portrait (next project). */
  portraitImage?: string;
  /** Under the cover on the home page. */
  description: string;
  /** On the project page, next to year, role and status. */
  additionalDescription: string;
  /** Shown on the home page next to the year, and as "Platform" on the project page. */
  platforms: string[];
  roles: string[];
  year: string;
  status: string;
  href: string;
  url?: string;
  /** App Store page: shown as the official badge instead of "See Project". */
  appStore?: string;
  /** The longer story on the project page: what it is for, the problem, what it does, my part. */
  overview?: OverviewItem[];
  gallery: GalleryRow[];
};

/** Two 4:5 phones side by side: frames `from` and `from + 1`. */
const frames = (slug: string, from = 1): GalleryRow => ({
  items: [from, from + 1].map((n) => ({ src: `/images/work/${slug}/frame-${n}.webp`, ratio: "4/5" })),
});

/** One 16:9 image: the stage (two phones) or the trio (three). */
const wide = (slug: string, name: string): GalleryRow => ({
  items: [{ src: `/images/work/${slug}/${name}.webp`, ratio: "16/9" }],
});

/** Order on the page: work shipped for clients first, then personal work. */
export const projects: Project[] = [
  {
    title: "Viaggiare Sicuri",
    coverImage: "/images/work/viaggiare-sicuri/cover.webp",
    portraitImage: "/images/work/viaggiare-sicuri/portrait.webp",
    description:
      "A work project, since May 2026: the travel-safety app of the Farnesina, Italy's Ministry of Foreign Affairs and International Cooperation, public on iOS and Android.",
    additionalDescription:
      "A work project: since May 2026 I have been working on it as a Mobile Developer inside a professional mobile team. My part, in a shared codebase, is feature implementation, interface work, integration, bug fixing and the maintenance a shipped app asks for, on an app people open before they leave the country.",
    platforms: ["iOS", "Android"],
    roles: ["Development"],
    year: "2026",
    status: "Work project · In production",
    href: "viaggiare-sicuri",
    overview: [
      {
        label: "What it is for",
        text: "Viaggiare Sicuri is the official app Italians use before and during a trip abroad. For every country in the world it gathers the safety information published by the Ministry of Foreign Affairs: security, health, local rules and the latest alerts, in one place and always up to date.",
      },
      {
        label: "The problem",
        text: "Travel advice is scattered and changes fast, and in an emergency the Crisis Unit needs to know which Italians are in a country. The app answers both: it tells travellers what they need to know about where they are going, and lets them register their trip, so the Ministry can reach them if something happens.",
      },
      {
        label: "What it does",
        text: "A country file with alerts, health and notices, and the date of the last update; a world map with the countries under advisory; a feed of the latest alerts; and the registration of a trip, or of a stay abroad, in a few steps.",
      },
      {
        label: "My part",
        text: "Since May 2026 I have been working on it as a Mobile Developer in the mobile team: new features, interface work on the screens, integration with the Ministry's services, bug fixing and the maintenance of an app in production on iOS and Android.",
      },
    ],
    gallery: [wide("viaggiare-sicuri", "stage"), wide("viaggiare-sicuri", "trio")],
  },
  {
    title: "Banca di Asti",
    coverImage: "/images/work/banca-di-asti/cover.webp",
    portraitImage: "/images/work/banca-di-asti/portrait.webp",
    description:
      "Mobile banking app for Banca di Asti, public on iOS and Android, built at Venture Lab on both native codebases.",
    additionalDescription:
      "Five months on a fixed-term contract at Venture Lab, from September 2025 to February 2026, as a Mobile Developer inside the team: feature implementation, interface work and bug fixing across the two native apps, UIKit on iOS and Kotlin on Android.",
    platforms: ["iOS", "Android"],
    roles: ["Development"],
    year: "2025",
    status: "In production",
    href: "banca-di-asti",
    overview: [
      {
        label: "What it is for",
        text: "The mobile banking app of Banca di Asti: the bank's customers use it to sign in and manage their accounts from their phone, on iOS and Android.",
      },
      {
        label: "The problem",
        text: "A banking app has to be simple and safe at the same time: people must get in quickly every day, and every access has to be protected. Signing in and setting up a personal PIN are the first things every customer meets, and they have to feel effortless.",
      },
      {
        label: "My part",
        text: "Five months at Venture Lab, from September 2025 to February 2026, on a fixed-term contract, as a Mobile Developer on both native apps: feature implementation, interface work and bug fixing, in UIKit on iOS and Kotlin on Android, inside the team that maintains the app.",
      },
    ],
    gallery: [frames("banca-di-asti", 1)],
  },
  {
    title: "Leyla",
    coverImage: "/images/work/leyla/cover.webp",
    portraitImage: "/images/work/leyla/portrait.webp",
    description:
      "A startup I founded with my boyfriend: a private app for two, built long-distance first. 30 downloads as of September 2026.",
    additionalDescription:
      "Leyla is a startup I started with my boyfriend, and as of September 2026 it counts 30 downloads. Written twice over a shared Go backend: SwiftUI with WidgetKit, HealthKit and MapKit on iOS, Jetpack Compose with Health Connect on Android, PostgreSQL underneath. Two native apps, one intent: making distance feel a little shorter.",
    platforms: ["iOS", "Android"],
    roles: ["Development"],
    year: "2026",
    status: "Startup · 30 downloads",
    href: "leyla",
    overview: [
      {
        label: "What it is for",
        text: "Leyla is a private app for two people, built first of all for couples who live far apart. It is a startup I started with my boyfriend, and as of September 2026 it counts 30 downloads.",
      },
      {
        label: "The problem",
        text: "Chat apps are made for talking, not for feeling close. When there are thousands of kilometres between two people, what is missing is the small, constant sense of the other being there.",
      },
      {
        label: "What it does",
        text: "One tap lets your partner know you are thinking of them, and a widget keeps them on your home screen. A map shows where both of you are and how far apart. A shared journal keeps your milestones and your days, with photos; games like the question of the day and quizzes help you know each other better; and Apple Health can share cycle tracking with your partner.",
      },
      {
        label: "Built with",
        text: "Two native apps over one shared backend: SwiftUI with WidgetKit, HealthKit and MapKit on iOS, Jetpack Compose with Health Connect on Android, and a Go backend on PostgreSQL.",
      },
    ],
    appStore: "https://apps.apple.com/us/app/leyla/id6793453891",
    gallery: [wide("leyla", "stage"), wide("leyla", "trio")],
  },
  {
    title: "LiveChess",
    coverImage: "/images/work/livechess/cover.webp",
    portraitImage: "/images/work/livechess/portrait.webp",
    description:
      "An Apple Developer Academy project: a chess game in mixed reality for Apple Vision Pro, on your own table or in a virtual hall.",
    additionalDescription:
      "Built at the Apple Developer Academy in Naples. Stockfish 17 runs on the device; the Lichess API brings Quick Pair, friends and bots for playing someone who is not in the room; the pieces come in different materials, previewed in 3D before the game. Built in Swift, SwiftUI and RealityKit for visionOS.",
    platforms: ["visionOS"],
    roles: ["Development"],
    year: "2026",
    status: "Academy project",
    href: "livechess",
    overview: [
      {
        label: "What it is for",
        text: "LiveChess is a chess game in mixed reality for Apple Vision Pro, built at the Apple Developer Academy in Naples. The board appears in your room, at real size, on your own table.",
      },
      {
        label: "The problem",
        text: "Playing chess online means playing on a flat screen, and you lose the board in front of you. Playing over a real board means finding someone in the same room. LiveChess keeps the physical feeling of the board and the opponents of online chess.",
      },
      {
        label: "What it does",
        text: "You can play against Stockfish 17, running on the device, choosing its strength and thinking time; or sign in with Lichess and play through Quick Pair, against a friend or against a Lichess bot. The board can be moved around the room, the pieces come in different materials previewed in 3D, and a virtual hall can replace your room entirely.",
      },
      {
        label: "Built with",
        text: "Swift, SwiftUI and RealityKit for visionOS, with an immersive space for the virtual hall, the Stockfish engine on device and the Lichess API.",
      },
    ],
    gallery: [
      wide("livechess", "room"),
      {
        items: [
          { src: "/images/work/livechess/lobby.webp", ratio: "16/9" },
          { src: "/images/work/livechess/pieces.webp", ratio: "16/9" },
        ],
      },
      wide("livechess", "virtual"),
    ],
  },
];
