import { type Lang, useLanguage } from "@/lib/language";

/** Interface strings: buttons, labels, hints, form. The copy lives in site.ts and projects.ts. */
const en = {
  menu: "menu",
  close: "close",
  language: "Language",
  switchTo: "Switch to Italian",
  portraitAlt: "Portrait of Claudia Napolitano",
  openToWork: "Open to work",
  unavailable: "Unavailable",
  viewProject: "View Project",
  nextProject: "Next Project",
  seeProject: "See Project",
  year: "Year",
  platform: "Platform",
  role: "Role",
  status: "Status",
  appStoreBadge: "/images/badges/app-store.svg",
  appStoreAlt: "Download on the App Store",
  appStoreLabel: (app: string) => `Download ${app} on the App Store`,
  services: "(Services)",
  clickMeLeft: "← click me",
  clickMeRight: "click me →",
  closeDetails: "(close)",
  form: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    message: "Message",
    messagePlaceholder: "What are you building?",
    send: "Send message",
    sending: "Sending",
    sendingNote: "Sending…",
    sent: "Sent. I will get back to you soon.",
    failed: "It did not go through, write to me directly:",
    direct: "Or write to me directly:",
  },
  notFound: {
    title: "Page not found",
    text: "This page does not exist, or not anymore.",
    back: "Back to the home page",
  },
};

export type UiStrings = typeof en;

const it: UiStrings = {
  menu: "menu",
  close: "chiudi",
  language: "Lingua",
  switchTo: "Passa all'inglese",
  portraitAlt: "Ritratto di Claudia Napolitano",
  openToWork: "Disponibile",
  unavailable: "Non disponibile",
  viewProject: "Vedi il progetto",
  nextProject: "Prossimo progetto",
  seeProject: "Vedi il progetto",
  year: "Anno",
  platform: "Piattaforma",
  role: "Ruolo",
  status: "Stato",
  appStoreBadge: "/images/badges/app-store-it.svg",
  appStoreAlt: "Scarica su App Store",
  appStoreLabel: (app: string) => `Scarica ${app} su App Store`,
  services: "(Servizi)",
  clickMeLeft: "← cliccami",
  clickMeRight: "cliccami →",
  closeDetails: "(chiudi)",
  form: {
    name: "Nome",
    namePlaceholder: "Il tuo nome",
    email: "Email",
    emailPlaceholder: "tu@esempio.com",
    message: "Messaggio",
    messagePlaceholder: "Cosa stai costruendo?",
    send: "Invia messaggio",
    sending: "Invio in corso",
    sendingNote: "Invio in corso…",
    sent: "Inviato. Ti rispondo presto.",
    failed: "Non è partito, scrivimi direttamente:",
    direct: "Oppure scrivimi direttamente:",
  },
  notFound: {
    title: "Pagina non trovata",
    text: "Questa pagina non esiste, o non esiste più.",
    back: "Torna alla home",
  },
};

export const uiStrings: Record<Lang, UiStrings> = { en, it };

export const useUi = () => uiStrings[useLanguage().lang];
