import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "@/styles/atelier.css";
import { useLanguage } from "@/lib/language";
import Header from "@/home/components/Header";
import MarbleBackdrop from "@/home/components/MarbleBackdrop";

const COPY = {
  en: {
    title: "This page does not exist",
    body: "The address you followed does not lead anywhere on this site. It may have been mistyped, or it may point at something that has since been rebuilt.",
    back: "Back to the home page",
  },
  it: {
    title: "Questa pagina non esiste",
    body: "L'indirizzo che hai seguito non porta da nessuna parte su questo sito. Può essere stato scritto male, oppure puntare a qualcosa che nel frattempo è stato rifatto.",
    back: "Torna alla home",
  },
};

const NotFound = () => {
  const location = useLocation();
  const { lang } = useLanguage();
  const copy = COPY[lang];

  useEffect(() => {
    console.error("404: route inesistente:", location.pathname);
  }, [location.pathname]);

  // The page carries the same surface as the rest of the site: a 404 on the
  // default shadcn styling reads as a different site having taken over.
  useEffect(() => {
    const body = document.body.style;
    const previous = body.background;
    body.background = "#0a0806";
    return () => {
      body.background = previous;
    };
  }, []);

  return (
    <div className="atelier">
      <MarbleBackdrop />
      <Header />

      <main className="a-work">
        <div className="a-work__head">
          <span className="a-label a-label--gold">404</span>
          <h1 className="a-work__title">{copy.title}</h1>
          <p className="a-body a-work__intro">{copy.body}</p>
          <p className="a-project__links">
            <Link className="a-project__link" to="/">
              {copy.back} <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
