import type { Lang } from "@/lib/language";

/**
 * Every project the counts below are drawn from: the apps in the coding
 * folder (2024 — 2026), the two client apps on the CV, and Uzbelia. Exercises,
 * checkpoints and tutorials are left out on purpose — a skill that has only
 * been through a lesson is not one to put a number on.
 *
 * Written once here so a name cannot be spelt two ways and counted twice.
 */
const P = {
  viaggiareSicuri: "Viaggiare Sicuri", // Akkodis → Farnesina, 2026
  asti: "Banca di Asti", //              Venturelab, 2025 — 2026
  leyla: "Leyla",
  liveChess: "LiveChess",
  stikar: "StikAR",
  uzbelia: "Uzbelia",
  tourism: "Tourism",
  peace: "Peace",
  buyMeAPie: "BuyMeAPie",
  calmm: "Calmm",
  challenge3: "Challenge 3",
  leggy: "Leggy", //                    the dyslexia reader
  himmel: "Himmel",
  waterApp: "WaterApp",
  gitExplorer: "GitExplorer",
  reclutia: "ReclutIA", //              The Big Hack, Naples 2025
  hsTracker: "HS Tracker",
  kram: "Kram",
} as const;

type Project = (typeof P)[keyof typeof P];

export type Skill = {
  name: string;
  /** The year it was first used for real work. The years shown are counted
   *  from here, so the page does not go stale on the first of January. */
  since: number;
  /** The projects that used it. The number on the page is this list's
   *  length, so every count can be checked — and grows by adding a name. */
  projects: Project[];
};

export type SkillGroup = {
  index: string;
  title: Record<Lang, string>;
  skills: Skill[];
};

/**
 * Where the start years come from: Swift from the two self-taught years before
 * the Apple Academy (autumn 2024); MVVM and async/await from the Upwork work
 * (February 2024); UIKit, Kotlin and REST from the Banca di Asti contract
 * (September 2025); the rest from the first project that used them.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    index: "01",
    title: { en: "Apple platforms", it: "Piattaforme Apple" },
    skills: [
      {
        name: "Swift",
        since: 2022,
        projects: [
          P.viaggiareSicuri, P.asti, P.leyla, P.liveChess, P.stikar, P.uzbelia,
          P.tourism, P.peace, P.buyMeAPie, P.calmm, P.challenge3, P.leggy,
          P.himmel, P.waterApp, P.gitExplorer, P.reclutia,
        ],
      },
      {
        name: "SwiftUI",
        since: 2022,
        projects: [
          P.leyla, P.liveChess, P.stikar, P.uzbelia, P.tourism, P.peace,
          P.buyMeAPie, P.calmm, P.challenge3, P.leggy, P.himmel, P.waterApp,
          P.gitExplorer, P.reclutia,
        ],
      },
      {
        name: "UIKit",
        since: 2025,
        projects: [P.viaggiareSicuri, P.asti, P.leyla, P.leggy, P.himmel],
      },
      {
        name: "ARKit · RealityKit",
        since: 2025,
        projects: [P.stikar, P.liveChess, P.himmel],
      },
      { name: "visionOS", since: 2026, projects: [P.liveChess] },
    ],
  },
  {
    index: "02",
    title: { en: "Android & services", it: "Android e servizi" },
    skills: [
      {
        name: "Kotlin",
        since: 2025,
        projects: [P.viaggiareSicuri, P.asti, P.leyla, P.stikar, P.peace, P.hsTracker],
      },
      {
        name: "Jetpack Compose",
        since: 2025,
        projects: [P.leyla, P.stikar, P.peace, P.hsTracker],
      },
      {
        name: "REST APIs",
        since: 2025,
        projects: [
          P.viaggiareSicuri, P.asti, P.leyla, P.liveChess, P.uzbelia,
          P.gitExplorer, P.hsTracker,
        ],
      },
      {
        name: "Firebase",
        since: 2025,
        projects: [P.stikar, P.peace, P.buyMeAPie, P.uzbelia, P.kram],
      },
      { name: "Go · PostgreSQL", since: 2026, projects: [P.leyla, P.kram] },
    ],
  },
  {
    index: "03",
    title: { en: "Architecture & frameworks", it: "Architettura e framework" },
    skills: [
      {
        name: "Swift Concurrency",
        since: 2024,
        projects: [
          P.viaggiareSicuri, P.leyla, P.gitExplorer, P.peace, P.uzbelia,
          P.calmm, P.leggy, P.himmel,
        ],
      },
      {
        name: "MVVM",
        since: 2024,
        projects: [P.viaggiareSicuri, P.leyla, P.peace, P.calmm, P.himmel, P.gitExplorer],
      },
      {
        name: "MapKit · Core Location",
        since: 2025,
        projects: [P.tourism, P.leyla, P.himmel],
      },
      { name: "SwiftData · Core Data", since: 2025, projects: [P.stikar, P.calmm] },
      { name: "Vision · Core ML", since: 2026, projects: [P.leggy, P.himmel] },
    ],
  },
];

/** How many distinct projects the whole chart is counted from. */
export const PROJECT_TOTAL = new Set(
  SKILL_GROUPS.flatMap((group) => group.skills.flatMap((skill) => skill.projects))
).size;
