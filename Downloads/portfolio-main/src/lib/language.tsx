import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "it" | "en";

type Dict = {
  // Nav
  navProjects: string;
  navAbout: string;
  navContact: string;

  // Phone canvas buttons
  phoneProjects: string;
  phoneAbout: string;
  phoneContact: string;

  // Quote section
  quoteLine1: string;
  quoteLine2: string;
  quoteAuthor: string;

  // Projects page
  projectsEyebrow: string;
  projectsTitle: string;
  projectsIntro: string;
  projectsViewGithub: string;
  projectsBack: string;

  // Project descriptions / tags
  leggyTag: string;
  leggyDescription: string;
  reclutiaTag: string;
  reclutiaDescription: string;
  stikarTag: string;
  stikarDescription: string;
  kramTag: string;
  kramDescription: string;

  // About page
  aboutEyebrow: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutAcademy: string;
  aboutPsychology: string;
  aboutHackathon: string;
  aboutLanguages: string;
};

const dictionaries: Record<Lang, Dict> = {
  it: {
    navProjects: "Progetti",
    navAbout: "Chi sono",
    navContact: "Contatti",

    phoneProjects: "i miei progetti",
    phoneAbout: "chi sono",
    phoneContact: "contattami",

    quoteLine1: "\"Il software è una straordinaria",
    quoteLine2: "combinazione tra arte e ingegneria\"",
    quoteAuthor: "-Bill Gates",

    projectsEyebrow: "Selected work",
    projectsTitle: "I miei progetti",
    projectsIntro:
      "Una piccola collezione di cose che ho costruito tra design, codice e curiosità — app iOS, hackathon, esperimenti in AR e tool per studenti.",
    projectsViewGithub: "Vedi su GitHub →",
    projectsBack: "← Torna alla home",

    leggyTag: "Swift Student Challenge",
    leggyDescription:
      "Un'app pensata per aiutare gli studenti dislessici nella lettura: testi accessibili, tipografia su misura e un voiceover integrato che accompagna parola per parola, per rendere lo studio meno faticoso e più sereno.",
    reclutiaTag: "Hackathon Winner — Crédit Agricole",
    reclutiaDescription:
      "Progetto vincitore dell'hackathon di ottobre 2025 a Napoli. Una piattaforma di selezione del personale che combina un'intervista sulle soft skill basata sul test personologico Big Five con un colloquio sulle hard skill condotto da un'IA locale (Ollama), restituendo al recruiter un profilo completo del candidato.",
    stikarTag: "Augmented Reality",
    stikarDescription:
      "Un'app che permette di posizionare sticker e foto nello spazio in realtà aumentata, con un database che salva tutti gli sticker visibili nella scena AR così da poterli ritrovare e riposizionare. Sviluppata sia in Kotlin che in Swift come progetto cross-platform.",
    kramTag: "EdTech",
    kramDescription:
      "Un'app pensata per gli studenti che hanno bisogno di una mano con la matematica: un risolutore basato su IA che spiega ogni passaggio e una libreria di lezioni divise per argomenti, dalle basi fino agli argomenti più avanzati.",

    aboutEyebrow: "About me",
    aboutTitle: "Claudia Napolitano",
    aboutIntro:
      "Mi chiamo Claudia Napolitano, sono una mobile developer italiana. Mi ritengo una persona abbastanza curiosa: mi è sempre piaciuto imparare e studiare in generale. Sono motivata dalle sfide complicate e mi piace migliorarmi ogni giorno.",
    aboutAcademy:
      "Ho iniziato il mio percorso da programmatrice due anni fa, imparando da autodidatta Python ed in seguito Swift, spinta dal mio essere circondata da dispositivi Apple sin da piccola. Volevo capire come funzionassero. Ho poi approfondito con la Apple Developer Academy di Napoli, iniziata nel 2024 con la Foundation, per poi capire di voler fare esattamente questo nella vita. Qui ho trovato una fantastica community internazionale, ho legato con persone provenienti da ogni parte del mondo. Nel tempo, mi sono avvicinata anche a Kotlin, durante lo sviluppo di alcuni progetti proprio qui in Academy.",
    aboutPsychology:
      "Contemporaneamente, studio alla facoltà di psicologia a Napoli; mi laureerò a luglio del 2026. Non ho mai visto i due percorsi come separati, anzi, credo vadano molto a braccetto. Ho trovato tantissimi modi di implementare teorie sul comportamento umano nello sviluppo di una UX funzionale ai bisogni degli utenti. Grazie alla scoperta di questo connubio, mi sono appassionata anche al training di IA ed al funzionamento di queste ultime, che ho scoperto essere incredibilmente simile a quello umano.",
    aboutHackathon:
      "Durante il mio percorso all'Apple Academy ho scoperto il mondo degli Hackathon, competizioni in cui si chiede a dei team di programmatori di costruire una soluzione ad un dato problema in 48 ore. Una full immersion in VSC non-stop, praticamente. Ho viaggiato per parteciparvi da Trieste fino a Stoccolma. Ad ottobre 2025 io ed il mio team ci portiamo a casa la vittoria giocando a Napoli, in casa, programmando “ReclutIA”, un'app che integra un famoso test personologico (il Big Five) con la selezione di personale per una banca italiana.",
    aboutLanguages:
      "Un altro pilastro della mia identità è l'amore per le lingue straniere: sono una poliglotta, al giorno d'oggi (2026) parlo sei lingue, continuandole a praticare sia in Academy che da sola. Ho iniziato da molto piccola, quando mia mamma già a tre anni, iniziò ad insegnarmi lo spagnolo grazie a dei videogiochi che l'istituto per bambini ispanofoni residenti in Italia della mia città metteva loro a disposizione. La mia lingua preferita? L'arabo.",
  },
  en: {
    navProjects: "Projects",
    navAbout: "About",
    navContact: "Contact",

    phoneProjects: "my projects",
    phoneAbout: "about me",
    phoneContact: "contact me",

    quoteLine1: "\"Software is a great combination",
    quoteLine2: "between artistry and engineering\"",
    quoteAuthor: "-Bill Gates",

    projectsEyebrow: "Selected work",
    projectsTitle: "My projects",
    projectsIntro:
      "A small collection of things I've built across design, code and curiosity — iOS apps, hackathons, AR experiments and tools for students.",
    projectsViewGithub: "View on GitHub →",
    projectsBack: "← Back to home",

    leggyTag: "Swift Student Challenge",
    leggyDescription:
      "An app designed to help dyslexic students read more comfortably: accessible text, custom typography and an integrated voiceover that follows the reader word by word, making studying less tiring and more relaxed.",
    reclutiaTag: "Hackathon Winner — Crédit Agricole",
    reclutiaDescription:
      "Winning project of the October 2025 hackathon in Naples. A recruiting platform that combines a soft-skill interview based on the Big Five personality test with a hard-skill conversation led by a local AI (Ollama), giving the recruiter a complete profile of every candidate.",
    stikarTag: "Augmented Reality",
    stikarDescription:
      "An app that lets you place stickers and photos in space using augmented reality, with a database that stores every sticker visible in the AR scene so you can find and reposition them later. Built in both Kotlin and Swift as a cross-platform project.",
    kramTag: "EdTech",
    kramDescription:
      "An app for students who need a hand with maths: an AI-based solver that explains every step and a library of lessons organised by topic, from the basics all the way to advanced subjects.",

    aboutEyebrow: "About me",
    aboutTitle: "Claudia Napolitano",
    aboutIntro:
      "My name is Claudia Napolitano, I'm an Italian mobile developer. I'd say I'm a fairly curious person: I've always loved learning and studying in general. I'm driven by tough challenges and I enjoy improving myself a little every day.",
    aboutAcademy:
      "I started my journey as a programmer two years ago, teaching myself Python first and then Swift, pushed by the fact that I've been surrounded by Apple devices since I was little. I wanted to understand how they worked. I then deepened my knowledge at the Apple Developer Academy in Naples, which I joined in 2024 with the Foundation programme, eventually realising that this is exactly what I wanted to do in life. There I found an incredible international community and bonded with people from all over the world. Along the way I also picked up Kotlin while working on some projects at the Academy.",
    aboutPsychology:
      "At the same time I'm studying at the faculty of Psychology in Naples; I'll graduate in July 2026. I've never seen the two paths as separate — quite the opposite, I think they go hand in hand. I've found so many ways to apply theories of human behaviour to building UX that actually fits users' needs. From this connection I also fell in love with AI training and with the way these systems work, which turns out to be surprisingly similar to how humans do.",
    aboutHackathon:
      "During my time at the Apple Academy I discovered the world of Hackathons — competitions where teams of developers are asked to build a solution to a given problem in 48 hours. Basically a non-stop full immersion in VSC. I've travelled to take part in them, from Trieste all the way to Stockholm. In October 2025 my team and I took home the win playing in Naples, at home, building “ReclutIA”, an app that integrates a famous personality test (the Big Five) with personnel selection for an Italian bank.",
    aboutLanguages:
      "Another pillar of my identity is my love for foreign languages: I'm a polyglot — today (2026) I speak six languages and I keep practising them both at the Academy and on my own. I started very young: when I was three, my mum began teaching me Spanish thanks to videogames provided by the institute for Spanish-speaking children living in Italy in my city. My favourite language? Arabic.",
  },
};

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "portfolio-lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Start with "it" on both server and first client render to avoid hydration
  // mismatches. The persisted choice (if any) is restored in the effect below.
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "it" || stored === "en") setLangState(stored as Lang);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: dictionaries[lang] }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
};
