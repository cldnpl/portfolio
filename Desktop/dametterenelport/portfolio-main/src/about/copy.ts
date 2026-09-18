import type { Lang } from "@/lib/language";

export type PhotoKey = "portrait" | "academy" | "hackathon" | "languages";

/**
 * Each slot carries the proportion of the file it holds, so a frame never
 * crops a photograph to fit a shape the page decided in advance. The files
 * come out of `scripts/prepare-about.py`, which resizes the originals in
 * ../art/about down to what the frames actually draw. A slot with `src: null`
 * still reserves its space and shows "photo pending".
 */
export const PHOTOS: Record<
  PhotoKey,
  { src: string | null; ratio: "tall" | "wide"; face?: boolean }
> = {
  // `face` asks for a lighter hand: the treatment that makes a room full of
  // desks sit on black stone turns a portrait into a silhouette.
  portrait: { src: "about/portrait.jpg", ratio: "tall", face: true },
  academy: { src: "about/academy.jpg", ratio: "wide" },
  hackathon: { src: "about/hackathon.jpg", ratio: "tall", face: true },
  languages: { src: "about/languages.jpg", ratio: "wide" },
};

type Chapter = {
  eyebrow: string;
  title: string;
  body: string[];
  tags?: { label: string; strong?: boolean }[];
};

export type AboutCopy = {
  eyebrow: string;
  name: string;
  intro: string;
  /** Shown inside a frame that has no photograph yet. */
  pending: string;
  captions: Record<PhotoKey, string>;
  alt: Record<PhotoKey, string>;
  /** The two short columns under the opening. */
  columns: { eyebrow: string; body: string }[];
  academy: Chapter;
  languages: Chapter;
};

const en: AboutCopy = {
  eyebrow: "About",
  name: "Claudia Napolitano",
  intro:
    "Italian mobile developer. Curious by default, motivated by problems that look unreasonable at first, and convinced that *understanding people is half of understanding software*.",
  pending: "Photo pending",
  captions: {
    portrait: "Portrait",
    academy: "At the Academy",
    hackathon: "Hackathon win — Naples 2025",
    languages: "Language notes",
  },
  alt: {
    portrait: "Claudia Napolitano",
    academy: "Claudia at the Apple Developer Academy in Naples",
    hackathon: "Claudia holding the winner's banner of the Naples hackathon, 2025",
    languages: "Claudia's notebooks: Arabic script, declension tables, colour-coded grammar",
  },
  columns: [
    {
      eyebrow: "Before the Academy",
      body: "*Self-taught*: Python first, then Swift, pushed by a childhood spent surrounded by Apple hardware I wanted to take apart. *Two years of building on my own* before anyone taught me anything — and Kotlin picked up later, out of the same curiosity.",
    },
    {
      eyebrow: "Psychology for UX — 110/110 with honours",
      body: "I did not study Psychology alongside the code by accident — *I chose it for UX*. Perception, attention and memory are the real constraints an interface has to respect, and reading them properly is what makes a screen feel obvious. Graduated in Naples, July 2026, *110/110 with honours*.",
    },
  ],
  academy: {
    eyebrow: "Apple Developer Academy · 2024 — 2027",
    title: "Three years at the Academy, hackathons across three cities",
    body: [
      "I joined the Apple Developer Academy in Naples with the Foundation programme in 2024 and I am still there, now on the *Advanced Research track that runs to 2027* — a year spent building and investigating rather than following a syllabus.",
      "Alongside it, hackathons: Naples, Trieste, Stockholm. *Forty-eight hours, one problem, no sleep.* The one I won was at home in Naples, October 2025, by doing the thing nobody else in the room was doing — *putting psychology inside the software*: ReclutIA, a hiring tool for an Italian bank built on the Big Five personality model.",
    ],
    tags: [
      { label: "Foundation 2024" },
      { label: "Advanced Research → 2027" },
      { label: "Naples" },
      { label: "Trieste" },
      { label: "Stockholm" },
      { label: "Winner — Naples 2025", strong: true },
    ],
  },
  languages: {
    eyebrow: "Six languages · still counting",
    title: "The other half of the work is listening",
    body: [
      "*Six languages today*, kept alive at the Academy and on my own. It started at three years old, when my mother taught me Spanish through the games an institute for Spanish-speaking children in Naples lent out.",
      "It is the same instinct as the psychology: a language is a set of rules people actually live in, and you only learn it by paying attention to them. *The favourite is Arabic.*",
    ],
  },
};

const it: AboutCopy = {
  eyebrow: "Chi sono",
  name: "Claudia Napolitano",
  intro:
    "Mobile developer italiana. Curiosa per impostazione, mossa dai problemi che all'inizio sembrano irragionevoli, e convinta che *capire le persone sia metà del capire il software*.",
  pending: "Foto in arrivo",
  captions: {
    portrait: "Ritratto",
    academy: "In Academy",
    hackathon: "Hackathon vinto — Napoli 2025",
    languages: "Appunti di lingue",
  },
  alt: {
    portrait: "Claudia Napolitano",
    academy: "Claudia all'Apple Developer Academy di Napoli",
    hackathon: "Claudia con lo striscione da vincitrice dell'hackathon di Napoli, 2025",
    languages: "I quaderni di Claudia: arabo scritto a mano, tabelle di declinazioni, grammatica a colori",
  },
  columns: [
    {
      eyebrow: "Prima dell'Academy",
      body: "*Da autodidatta*: prima Python, poi Swift, spinta da un'infanzia passata in mezzo a dispositivi Apple che volevo smontare. *Due anni a costruire da sola* prima che qualcuno mi insegnasse qualcosa — e Kotlin arrivato dopo, per la stessa curiosità.",
    },
    {
      eyebrow: "Psicologia per la UX — 110/110 con lode",
      body: "Non ho studiato Psicologia accanto al codice per caso: *l'ho scelta per la UX*. Percezione, attenzione e memoria sono i vincoli veri che un'interfaccia deve rispettare, e leggerli bene è ciò che rende una schermata ovvia. Laureata a Napoli, luglio 2026, *110/110 con lode*.",
    },
  ],
  academy: {
    eyebrow: "Apple Developer Academy · 2024 — 2027",
    title: "Tre anni in Academy, hackathon in tre città",
    body: [
      "Sono entrata all'Apple Developer Academy di Napoli con il programma Foundation nel 2024 e ci sono ancora, ora sul *percorso Advanced Research che arriva al 2027* — un anno passato a costruire e a indagare invece che a seguire un programma.",
      "Accanto, gli hackathon: Napoli, Trieste, Stoccolma. *Quarantotto ore, un problema, zero sonno.* Quello che ho vinto era in casa, a Napoli, a ottobre 2025, facendo l'unica cosa che nessun altro in sala stava facendo: *mettere la psicologia dentro il software* con ReclutIA, uno strumento di selezione per una banca italiana costruito sul modello di personalità Big Five.",
    ],
    tags: [
      { label: "Foundation 2024" },
      { label: "Advanced Research → 2027" },
      { label: "Napoli" },
      { label: "Trieste" },
      { label: "Stoccolma" },
      { label: "Vittoria — Napoli 2025", strong: true },
    ],
  },
  languages: {
    eyebrow: "Sei lingue · e non è finita",
    title: "L'altra metà del lavoro è ascoltare",
    body: [
      "*Oggi sono sei*, tenute vive in Academy e da sola. È cominciata a tre anni, quando mia madre mi ha insegnato lo spagnolo con i videogiochi che l'istituto per bambini ispanofoni di Napoli metteva a disposizione.",
      "È lo stesso istinto della psicologia: una lingua è un insieme di regole in cui le persone vivono davvero, e la impari solo facendo attenzione a loro. *La preferita è l'arabo.*",
    ],
  },
};

export const aboutCopy: Record<Lang, AboutCopy> = { en, it };
