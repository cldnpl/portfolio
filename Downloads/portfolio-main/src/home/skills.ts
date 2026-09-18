import type { Lang } from "@/lib/language";

export type Skill = {
  name: string;
  /** 0–100. Self-assessed, and deliberately coarse: these are rounded to
   *  fives because finer numbers would claim a precision nobody has. */
  level: number;
};

export type SkillGroup = {
  index: string;
  title: Record<Lang, string>;
  skills: Skill[];
};

/**
 * Taken from the CV and from the projects in the index: Leyla (SwiftUI +
 * WidgetKit + Compose + Go), LiveChess (visionOS, RealityKit, immersive
 * spaces), StikAR (ARKit and ARCore), Uzbelia (AVFoundation), Tourism
 * (MapKit, AVSpeechSynthesizer).
 */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    index: "01",
    title: { en: "Apple platforms", it: "Piattaforme Apple" },
    skills: [
      { name: "Swift", level: 95 },
      { name: "SwiftUI", level: 90 },
      { name: "UIKit", level: 85 },
      { name: "RealityKit · ARKit", level: 80 },
      { name: "visionOS", level: 70 },
      { name: "WidgetKit · HealthKit", level: 70 },
    ],
  },
  {
    index: "02",
    title: { en: "Android & services", it: "Android e servizi" },
    skills: [
      { name: "Kotlin", level: 80 },
      { name: "Jetpack Compose", level: 75 },
      { name: "ARCore", level: 65 },
      { name: "REST · URLSession", level: 90 },
      { name: "Firebase", level: 80 },
      { name: "Go · PostgreSQL", level: 60 },
    ],
  },
  {
    index: "03",
    title: { en: "Other", it: "Altro" },
    skills: [
      { name: "MVVM · Modular", level: 90 },
      { name: "Swift Concurrency", level: 85 },
      { name: "SwiftData · Core Data", level: 85 },
      { name: "Vision · MapKit", level: 75 },
      { name: "Figma · HIG", level: 80 },
      { name: "Git · Xcode", level: 90 },
    ],
  },
];
