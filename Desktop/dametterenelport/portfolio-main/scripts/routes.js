export const ROUTES = ["/", "/projects", "/about", "/contact"]; 

// Basic per-route metadata used by prerender + sitemap.
export const ROUTE_META = {
  "/": {
    title: "Claudia Napolitano — Portfolio 3D",
    description:
      "Portfolio 3D di Claudia Napolitano con animazioni interattive, modello iPhone personalizzato e contenuti ottimizzati per SEO.",
    ogTitle: "Claudia Napolitano — Portfolio 3D",
    ogDescription: "Portfolio 3D con modello iPhone interattivo, animazioni scroll e layout ottimizzato per SEO.",
  },
  "/projects": {
    title: "Projects — Claudia Napolitano",
    description: "I progetti di Claudia Napolitano: portfolio, app e prototipi interattivi.",
    ogTitle: "Projects — Claudia Napolitano",
    ogDescription: "Scopri i progetti e le demo di Claudia Napolitano.",
  },
  "/about": {
    title: "About — Claudia Napolitano",
    description: "Chi è Claudia Napolitano: percorso, interessi e background.",
    ogTitle: "About — Claudia Napolitano",
    ogDescription: "Percorso personale e professionale di Claudia Napolitano.",
  },
  "/contact": {
    title: "Contact — Claudia Napolitano",
    description: "Contatta Claudia Napolitano: link, profili e contatti.",
    ogTitle: "Contact — Claudia Napolitano",
    ogDescription: "Contatti e link utili per Claudia Napolitano.",
  },
};

export const getRouteMeta = (route) => ROUTE_META[route] ?? ROUTE_META["/"];
