import type { Lang } from "@/lib/language";

export type Skill = {
  name: string;
  /** The year it was first used. The years shown are counted from here —
   *  never fewer than one — so the page does not go stale on the first of
   *  January. */
  since: number;
  /** How many projects used it. This is what the bar measures. */
  projects: number;
};

export type SkillGroup = {
  index: string;
  title: Record<Lang, string>;
  skills: Skill[];
};

/**
 * Apple platforms since 2024, Kotlin and Compose since 2025. The project
 * counts cover the apps in the coding folder, the Academy challenges, the
 * client work on the CV (Viaggiare Sicuri, Banca di Asti), Uzbelia and
 * Interviews; Kotlin and Compose are Claudia's own numbers, which include
 * Android work that is not in the folder.
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    index: "01",
    title: { en: "Apple platforms", it: "Piattaforme Apple" },
    skills: [
      { name: "Swift", since: 2024, projects: 19 },
      { name: "SwiftUI", since: 2024, projects: 17 },
      { name: "UIKit", since: 2024, projects: 5 },
      { name: "ARKit · RealityKit", since: 2025, projects: 3 },
      { name: "visionOS", since: 2026, projects: 1 },
    ],
  },
  {
    index: "02",
    title: { en: "Android & services", it: "Android e servizi" },
    skills: [
      { name: "Kotlin", since: 2025, projects: 8 },
      { name: "Jetpack Compose", since: 2025, projects: 6 },
      { name: "REST APIs", since: 2024, projects: 9 },
      { name: "Firebase", since: 2025, projects: 5 },
      { name: "Go · PostgreSQL", since: 2026, projects: 2 },
    ],
  },
  {
    index: "03",
    title: { en: "Architecture & frameworks", it: "Architettura e framework" },
    skills: [
      { name: "Swift Concurrency", since: 2024, projects: 8 },
      { name: "MVVM", since: 2024, projects: 6 },
      { name: "MapKit · Core Location", since: 2025, projects: 3 },
      { name: "SwiftData · Core Data", since: 2025, projects: 2 },
      { name: "Vision · Core ML", since: 2026, projects: 2 },
    ],
  },
];

/** Marks in a full bar. */
export const BAR_MARKS = 20;

const MOST_PROJECTS = Math.max(
  ...SKILL_GROUPS.flatMap((group) => group.skills.map((skill) => skill.projects))
);

/**
 * How many marks a skill's bar gets: how much it has been used, on a
 * generous curve. A straight count drew two marks for two projects, which
 * reads as having barely touched something that shipped in two apps. The
 * bar starts half full, and the square root lets the first few projects move
 * it the most — the order between skills is kept, the steps between the
 * small ones are not flattened into nothing.
 */
export function barMarks(projects: number) {
  const share = Math.sqrt(Math.min(1, projects / MOST_PROJECTS));
  return Math.round(BAR_MARKS * (0.5 + 0.5 * share));
}
