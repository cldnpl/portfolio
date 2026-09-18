/**
 * The site's own address, stated here rather than left to the environment.
 *
 * A canonical link is a claim about who owns a page, and getting it from an
 * environment variable means a build that runs without it quietly publishes
 * the wrong claim. SITE_ORIGIN still overrides this for a staging deploy.
 */
export const SITE_ORIGIN =
  (process.env.SITE_ORIGIN || "https://claudianapolitano.dev").replace(/\/$/, "");

// /contact is deliberately absent: the contact form is the last section of the
// home page, and the old standalone page at that address was a thin duplicate
// on the previous design. It redirects to /#contact (see vercel.json), so it
// must not be prerendered or listed in the sitemap.
export const ROUTES = ["/", "/projects", "/about"];

// Basic per-route metadata used by prerender + sitemap.
// English, like the page these tags describe: the site opens in English and a
// search result that answers in another language than the page it opens is a
// broken promise.
export const ROUTE_META = {
  "/": {
    title: "Claudia Napolitano — Mobile Developer",
    description:
      "Native mobile developer from Naples. iOS, Android and visionOS apps built at the Apple Developer Academy and in hackathon rooms.",
    ogTitle: "Claudia Napolitano — Mobile Developer",
    ogDescription:
      "Native apps for iOS, Android and visionOS, shown on the devices they were built for.",
  },
  "/projects": {
    title: "Projects — Claudia Napolitano",
    description:
      "Selected projects: native apps for iOS, Android and visionOS, every screen a capture from the running app.",
    ogTitle: "Projects — Claudia Napolitano",
    ogDescription: "Native apps for iOS, Android and visionOS, with real captures.",
  },
  "/about": {
    title: "About — Claudia Napolitano",
    description:
      "Self-taught developer, Apple Developer Academy 2024—2027, a degree in Psychology for UX and six languages.",
    ogTitle: "About — Claudia Napolitano",
    ogDescription: "Code, psychology and languages: the path behind the work.",
  },
  "/contact": {
    title: "Contact — Claudia Napolitano",
    description: "Get in touch with Claudia Napolitano: a project, a role, or a question.",
    ogTitle: "Contact — Claudia Napolitano",
    ogDescription: "A project, a role, or a question — the message lands directly with me.",
  },
};

export const getRouteMeta = (route) => ROUTE_META[route] ?? ROUTE_META["/"];

/**
 * Structured data for the person the site is about.
 *
 * "Claudia Napolitano" is a query about a person, not about a topic, so the
 * thing that decides whether this site is the answer is whether a search
 * engine can tie the domain to an entity. sameAs is what does that work: it
 * says this site, that GitHub account and that LinkedIn profile are one
 * person, and those profiles already rank. Everything here is stated on the
 * site itself — nothing invented for the crawler.
 */
export const personJsonLd = (origin) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Claudia Napolitano",
  url: `${origin}/`,
  image: `${origin}/opengraph-image.jpg`,
  jobTitle: ["Mobile Developer", "Sviluppatrice mobile"],
  description:
    "Native mobile developer from Naples: iOS, visionOS and Android, with a degree in Psychology applied to UX.",
  email: "mailto:napolitano.claudia@icloud.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Naples",
    addressRegion: "Campania",
    addressCountry: "IT",
  },
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Apple Developer Academy",
    address: { "@type": "PostalAddress", addressLocality: "Naples", addressCountry: "IT" },
  },
  knowsAbout: [
    "iOS development",
    "Swift",
    "SwiftUI",
    "UIKit",
    "visionOS",
    "RealityKit",
    "ARKit",
    "Android development",
    "Kotlin",
    "Jetpack Compose",
    "User experience",
  ],
  sameAs: ["https://github.com/cldnpl", "https://www.linkedin.com/in/claudia-napolitano-1660b533a"],
});

export const siteJsonLd = (origin) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Claudia Napolitano",
  url: `${origin}/`,
  inLanguage: ["en", "it"],
  author: { "@type": "Person", name: "Claudia Napolitano", url: `${origin}/` },
});
