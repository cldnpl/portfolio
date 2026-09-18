export const ROUTES = ["/", "/projects", "/about", "/contact"]; 

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
    title: "Work — Claudia Napolitano",
    description:
      "Selected projects: native apps for iOS, Android and visionOS, every screen a capture from the running app.",
    ogTitle: "Work — Claudia Napolitano",
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
