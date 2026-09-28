export type GalleryItem = { src: string; ratio: string; alt?: string };
export type GalleryRow = { items: GalleryItem[] };

export type Project = {
  title: string;
  coverImage: string;
  /** One phone, 4:5: used where the layout is portrait (next project). */
  portraitImage?: string;
  /** Under the cover on the home page. Key concepts in **bold**. */
  description: string;
  /**
   * On the project page, next to year, platform, role and status: what the app
   * is for, the problem it solves, what it does, my part. One or more paragraphs,
   * all in the same small type. Key concepts in **bold**.
   */
  additionalDescription: string[];
  /** Shown on the home page next to the year, and as "Platform" on the project page. */
  platforms: string[];
  roles: string[];
  year: string;
  status: string;
  href: string;
  url?: string;
  /** App Store page: shown as the official badge instead of "See Project". */
  appStore?: string;
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
      "A **work project**, since **May 2026**: the **travel-safety app of the Farnesina**, Italy's Ministry of Foreign Affairs and International Cooperation, public on **iOS and Android**.",
    additionalDescription: [
      "A **work project**: since **May 2026** I have been working on it as a **Mobile Developer** inside a professional mobile team. Viaggiare Sicuri is the **official app Italians use before and during a trip abroad**: for every country in the world it gathers the safety information published by the **Ministry of Foreign Affairs** about security, health, local rules and the latest alerts, in one place and always up to date.",
      "It solves two problems at once. Travel advice is **scattered and changes fast**, and in an emergency the **Crisis Unit** needs to know which Italians are in a country. The app tells travellers what they need to know about where they are going, and lets them **register their trip**, so the Ministry can reach them if something happens. Inside there is a **country file** with alerts, health and notices, a **world map** of the countries under advisory, a **feed of the latest alerts** and the trip registration in a few steps.",
      "My part, in a shared codebase: **new features**, **interface work** on the screens, **integration** with the Ministry's services, **bug fixing** and the maintenance of an app **in production on iOS and Android**.",
    ],
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
      "**Mobile banking app** for Banca di Asti, public on **iOS and Android**, built at **Venture Lab** on both native codebases.",
    additionalDescription: [
      "The **mobile banking app of Banca di Asti**: the bank's customers use it to sign in and manage their accounts from their phone, on **iOS and Android**. A banking app has to be **simple and safe at the same time**: people get in every day, and every access has to be protected, starting from the sign in and the **personal PIN** every customer sets up first.",
      "**Five months at Venture Lab**, from September 2025 to February 2026, on a fixed-term contract, as a **Mobile Developer on both native apps**: feature implementation, interface work and bug fixing, in **UIKit on iOS** and **Kotlin on Android**, inside the team that maintains the app.",
    ],
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
      "A **startup** I founded with my boyfriend: a **private app for two**, built long-distance first. **30 downloads** as of September 2026.",
    additionalDescription: [
      "Leyla is a **startup I started with my boyfriend**, and as of **September 2026** it counts **30 downloads**. It is a **private app for two people**, built first of all for **couples who live far apart**: chat apps are made for talking, not for feeling close, and when there are thousands of kilometres in between, what is missing is the small, constant sense of the other being there.",
      "**One tap** lets your partner know you are thinking of them, and a **widget** keeps them on your home screen. A **map** shows where both of you are and how far apart; a **shared journal** keeps your milestones and your days, with photos; **games** like the question of the day and quizzes help you know each other better; and **Apple Health** can share cycle tracking with your partner.",
      "Two **native apps over one shared backend**: **SwiftUI** with WidgetKit, HealthKit and MapKit on iOS, **Jetpack Compose** with Health Connect on Android, and a **Go** backend on PostgreSQL.",
    ],
    platforms: ["iOS", "Android"],
    roles: ["Development"],
    year: "2026",
    status: "Startup · 30 downloads",
    href: "leyla",
    appStore: "https://apps.apple.com/us/app/leyla/id6793453891",
    gallery: [wide("leyla", "stage"), wide("leyla", "trio")],
  },
  {
    title: "LiveChess",
    coverImage: "/images/work/livechess/cover.webp",
    portraitImage: "/images/work/livechess/portrait.webp",
    description:
      "An **Apple Developer Academy** project: a **chess game in mixed reality** for Apple Vision Pro, on your own table or in a virtual hall.",
    additionalDescription: [
      "Built at the **Apple Developer Academy** in Naples, LiveChess is a **chess game in mixed reality** for **Apple Vision Pro**: the board appears in your room, at real size, **on your own table**. Online chess loses the board in front of you, and a real board needs someone in the same room; LiveChess keeps **the physical board and the opponents of online chess**.",
      "You can play against **Stockfish 17, running on the device**, choosing its strength and thinking time, or sign in with **Lichess** and play through Quick Pair, against a friend or against a Lichess bot. The board can be **moved around the room**, the pieces come in **different materials previewed in 3D**, and a **virtual hall** can replace your room entirely. Built in **Swift, SwiftUI and RealityKit** for visionOS.",
    ],
    platforms: ["visionOS"],
    roles: ["Development"],
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

/* ------------------------------------------------------------------ */
/* Italian: only the fields that change, by href. Key concepts in **bold**. */

type ProjectCopy = Pick<Project, "description" | "additionalDescription" | "status" | "roles">;

const projectsIt: Record<string, ProjectCopy> = {
  "viaggiare-sicuri": {
    description:
      "Un **progetto di lavoro**, da **maggio 2026**: l'**app per viaggiare sicuri della Farnesina**, il Ministero degli Affari Esteri e della Cooperazione Internazionale, pubblica su **iOS e Android**.",
    additionalDescription: [
      "Un **progetto di lavoro**: da **maggio 2026** ci lavoro come **Mobile Developer** dentro un team mobile professionale. Viaggiare Sicuri è l'**app ufficiale che gli italiani usano prima e durante un viaggio all'estero**: per ogni paese del mondo raccoglie le informazioni pubblicate dal **Ministero degli Affari Esteri** su sicurezza, salute, norme locali e ultimi avvisi, in un unico posto e sempre aggiornate.",
      "Risolve due problemi insieme. Le informazioni di viaggio sono **sparse e cambiano in fretta**, e in un'emergenza l'**Unità di Crisi** deve sapere quali italiani si trovano in un paese. L'app dice a chi viaggia quello che deve sapere sulla sua destinazione e gli permette di **registrare il viaggio**, così il Ministero può raggiungerlo se succede qualcosa. Dentro ci sono la **scheda paese** con allerta, sanità e avvisi, una **mappa del mondo** con i paesi da tenere d'occhio, un **feed degli ultimi avvisi** e la registrazione del viaggio in pochi passaggi.",
      "La mia parte, in un codebase condiviso: **nuove funzionalità**, **lavoro sull'interfaccia** delle schermate, **integrazione** con i servizi del Ministero, **correzione di bug** e la manutenzione di un'app **in produzione su iOS e Android**.",
    ],
    status: "Progetto di lavoro · In produzione",
    roles: ["Sviluppo"],
  },
  "banca-di-asti": {
    description:
      "**App di mobile banking** per la Banca di Asti, pubblica su **iOS e Android**, sviluppata in **Venture Lab** su entrambi i codebase nativi.",
    additionalDescription: [
      "L'**app di mobile banking della Banca di Asti**: i clienti della banca la usano per accedere e gestire i propri conti dal telefono, su **iOS e Android**. Un'app bancaria deve essere **semplice e sicura allo stesso tempo**: le persone ci entrano ogni giorno e ogni accesso va protetto, a partire dal login e dal **PIN personale** che ogni cliente crea per prima cosa.",
      "**Cinque mesi in Venture Lab**, da settembre 2025 a febbraio 2026, con un contratto a tempo determinato, come **Mobile Developer su entrambe le app native**: implementazione di funzionalità, lavoro sull'interfaccia e correzione di bug, in **UIKit su iOS** e **Kotlin su Android**, dentro il team che mantiene l'app.",
    ],
    status: "In produzione",
    roles: ["Sviluppo"],
  },
  leyla: {
    description:
      "Una **startup** che ho fondato con il mio ragazzo: un'**app privata per due**, pensata prima di tutto per la distanza. **30 download** a settembre 2026.",
    additionalDescription: [
      "Leyla è una **startup che ho avviato con il mio ragazzo** e a **settembre 2026** conta **30 download**. È un'**app privata per due persone**, pensata prima di tutto per le **coppie che vivono lontane**: le app di chat servono a parlare, non a sentirsi vicini, e quando ci sono migliaia di chilometri in mezzo quello che manca è la sensazione piccola e costante che l'altro ci sia.",
      "Con **un tocco** fai sapere all'altro che lo stai pensando, e un **widget** lo tiene sulla schermata Home. Una **mappa** mostra dove siete tutti e due e quanto siete lontani; un **diario condiviso** conserva le vostre tappe e le vostre giornate, con le foto; **giochi** come la domanda del giorno e i quiz vi aiutano a conoscervi meglio; e **Apple Salute** può condividere con il partner il monitoraggio del ciclo.",
      "Due **app native su un unico backend condiviso**: **SwiftUI** con WidgetKit, HealthKit e MapKit su iOS, **Jetpack Compose** con Health Connect su Android, e un backend in **Go** su PostgreSQL.",
    ],
    status: "Startup · 30 download",
    roles: ["Sviluppo"],
  },
  livechess: {
    description:
      "Un progetto dell'**Apple Developer Academy**: un **gioco di scacchi in realtà mista** per Apple Vision Pro, sul tuo tavolo o in una sala virtuale.",
    additionalDescription: [
      "Sviluppato all'**Apple Developer Academy** di Napoli, LiveChess è un **gioco di scacchi in realtà mista** per **Apple Vision Pro**: la scacchiera appare nella tua stanza, a grandezza reale, **sul tuo tavolo**. Gli scacchi online ti tolgono la scacchiera davanti, e una scacchiera vera richiede qualcuno nella stessa stanza; LiveChess tiene insieme **la scacchiera fisica e gli avversari degli scacchi online**.",
      "Puoi giocare contro **Stockfish 17, che gira sul dispositivo**, scegliendone forza e tempo di riflessione, oppure accedere con **Lichess** e giocare con Quick Pair, contro un amico o contro un bot di Lichess. La scacchiera si può **spostare nella stanza**, i pezzi sono disponibili in **materiali diversi con anteprima in 3D**, e una **sala virtuale** può sostituire del tutto la tua stanza. Sviluppato in **Swift, SwiftUI e RealityKit** per visionOS.",
    ],
    status: "Progetto dell'Academy",
    roles: ["Sviluppo"],
  },
};

export const localizeProject = (project: Project, lang: "en" | "it"): Project =>
  lang === "it" && projectsIt[project.href] ? { ...project, ...projectsIt[project.href] } : project;

export const localizedProjects = (lang: "en" | "it") => projects.map((p) => localizeProject(p, lang));
