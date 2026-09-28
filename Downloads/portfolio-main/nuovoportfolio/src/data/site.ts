import { projects } from "@/data/projects";

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
  ],
};

export const aboutData = {
  heading: "About",
  content: [
    "I design and build native mobile apps with a focus on precision, motion and the people using them — creating interfaces where every detail is intentional.",
    "Based in Naples, I work at the intersection of software and psychology. Three years at the Apple Developer Academy in Naples: the Foundation programme in 2024, the one-year Academy in 2025–2026, and now ARTE, the 2026–2027 advanced research programme on augmented reality and Apple Vision Pro development.",
    "In October 2025 I won a hackathon in Naples, building an app for Crédit Agricole Italia. From SwiftUI to Compose to visionOS, I take ideas from the first sketch to the store with meticulous attention to detail.",
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

export const servicesData: { content: string; servicesIntro: string; services: Service[] } = {
  content:
    "\"Most apps are built to be used; very few are built to be understood. I studied psychology for exactly that reason, and I write the native code myself, in Swift, in Kotlin and for visionOS, so nothing gets lost between how people think and what ends up on their screen. Every screen measured, every animation with a reason, every millisecond accounted for. If your product deserves to feel obvious, let's make sure it does.\"",
  servicesIntro:
    "I'm a developer who taught herself Python and then Swift, graduated in Psychology with 110/110 cum laude because interfaces are made for minds, and spent three years at the Apple Developer Academy in Naples, the last one on augmented reality and Vision Pro. Hackathons in Naples, Trieste and Stockholm, the one in Naples won for Crédit Agricole. Six languages spoken. I'm here to take an idea and bring it natively to iOS, Android and visionOS with the care it deserves. Software that respects the people using it, not just the specs it was written from.",
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
      items: ["User research", "Perception & attention", "Accessibility", "Prototyping"],
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
  "Claudia Napolitano is a mobile developer based in Naples, designing and building native apps for iOS, Android and visionOS with a focus on precision, motion, and the people using them.";

export const homeSeo = {
  title: "Claudia Napolitano | Mobile Developer",
  description,
  keywords:
    "Claudia Napolitano, Portfolio, Mobile Development, iOS, Android, visionOS, Swift, Kotlin, Mobile Developer",
  canonical: SITE_URL,
  image: `${SITE_URL}/images/portrait-og.jpg`,
};
