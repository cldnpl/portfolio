export type GalleryItem = { src: string; ratio: string; alt?: string };
export type GalleryRow = { items: GalleryItem[] };

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
      "A work project, since May 2026: the travel-safety app of the Farnesina — Italy's Ministry of Foreign Affairs and International Cooperation — public on iOS and Android.",
    additionalDescription:
      "A work project: since May 2026 I have been working on it as a Mobile Developer inside a professional mobile team. My part, in a shared codebase, is feature implementation, interface work, integration, bug fixing and the maintenance a shipped app asks for — on an app people open before they leave the country.",
    platforms: ["iOS", "Android"],
    roles: ["Development"],
    year: "2026",
    status: "Work project · In production",
    href: "viaggiare-sicuri",
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
    roles: ["Design", "Development"],
    year: "2026",
    status: "Startup · 30 downloads",
    href: "leyla",
    url: "https://github.com/cldnpl/Leyla-app",
    gallery: [wide("leyla", "stage"), wide("leyla", "trio")],
  },
  {
    title: "LiveChess",
    coverImage: "/images/work/livechess/cover.webp",
    description:
      "An Apple Developer Academy project: a chess game in mixed reality for Apple Vision Pro, on your own table or in a virtual hall.",
    additionalDescription:
      "Built at the Apple Developer Academy in Naples. Stockfish 17 runs on the device; the Lichess API brings Quick Pair, friends and bots for playing someone who is not in the room; the pieces come in different materials, previewed in 3D before the game. Built in Swift, SwiftUI and RealityKit for visionOS.",
    platforms: ["visionOS"],
    roles: ["Design", "Development"],
    year: "2026",
    status: "Academy project",
    href: "livechess",
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
