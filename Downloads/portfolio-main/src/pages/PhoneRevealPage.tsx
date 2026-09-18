import AnimatedBackground from "@/components/landing/AnimatedBackground";
import { Link } from "react-router-dom";
import { useLanguage, type Lang } from "@/lib/language";

type PageKind = "projects" | "about" | "contact";

type PhoneRevealPageProps = {
  kind: PageKind;
};

type Block = { eyebrow: string; title: string; text: string; action: string };

const pageCopy: Record<Lang, Record<PageKind, Block>> = {
  en: {
    projects: {
      eyebrow: "Selected",
      title: "My Projects",
      text: "A focused space for Claudia's interactive, visual and software projects.",
      action: "Back to portfolio",
    },
    about: {
      eyebrow: "Profile",
      title: "About Me",
      text: "A closer look at the person behind the interface: code, design, languages and creative systems.",
      action: "Back to portfolio",
    },
    contact: {
      eyebrow: "Connect",
      title: "Contact Me",
      text: "A direct page for links, collaborations and ways to reach Claudia.",
      action: "Back to portfolio",
    },
  },
  it: {
    projects: {
      eyebrow: "Selezione",
      title: "I miei progetti",
      text: "Uno spazio dedicato ai progetti interattivi, visivi e software di Claudia.",
      action: "Torna al portfolio",
    },
    about: {
      eyebrow: "Profilo",
      title: "Chi sono",
      text: "Uno sguardo più da vicino sulla persona dietro l'interfaccia: codice, design, lingue e sistemi creativi.",
      action: "Torna al portfolio",
    },
    contact: {
      eyebrow: "Contatti",
      title: "Scrivimi",
      text: "Una pagina diretta per link, collaborazioni e modi per raggiungere Claudia.",
      action: "Torna al portfolio",
    },
  },
};

const PhoneRevealPage = ({ kind }: PhoneRevealPageProps) => {
  const { lang } = useLanguage();
  const copy = pageCopy[lang][kind];

  return (
    <main className="portfolio-detail-page">
      <AnimatedBackground />
      <section className="portfolio-detail-content" aria-labelledby={`${kind}-title`}>
        <Link className="portfolio-detail-mark" to="/">
          CN
        </Link>
        <p className="portfolio-detail-eyebrow">{copy.eyebrow}</p>
        <h1 id={`${kind}-title`}>{copy.title}</h1>
        <p>{copy.text}</p>
        <Link className="portfolio-detail-link" to="/">
          {copy.action}
        </Link>
      </section>
    </main>
  );
};

export default PhoneRevealPage;
