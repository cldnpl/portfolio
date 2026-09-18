import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type AboutBlock = {
  id: string;
  align: "left" | "right";
  image?: {
    src: string;
    alt: string;
    variant?: "wide" | "portrait" | "square" | "notes";
  };
  text: string;
};

const aboutBlocks: AboutBlock[] = [
  {
    id: "academy",
    align: "left",
    image: {
      src: "/about/academy-group.jpg",
      alt: "Claudia con la community dell'Apple Developer Academy",
      variant: "wide",
    },
    text: "Ho iniziato il mio percorso da programmatrice due anni fa, imparando da autodidatta Python ed in seguito Swift, spinta dal mio essere circondata da dispositivi Apple sin da piccola. Volevo capire come funzionassero. Ho poi approfondito con la Apple Developer Academy di Napoli, iniziata nel 2024 con la Foundation, per poi capire di voler fare esattamente questo nella vita. Qui ho trovato una fantastica community internazionale, ho legato con persone provenienti da ogni parte del mondo. Nel tempo, mi sono avvicinata anche a Kotlin, durante lo sviluppo di alcuni progetti proprio qui in Academy.",
  },
  {
    id: "psychology",
    align: "right",
    text: "Contemporaneamente, studio alla facoltà di psicologia a Napoli; mi laureerò a luglio del 2026. Non ho mai visto i due percorsi come separati, anzi, credo vadano molto a braccetto. Ho trovato tantissimi modi di implementare teorie sul comportamento umano nello sviluppo di una UX funzionale ai bisogni degli utenti. Grazie alla scoperta di questo connubio, mi sono appassionata anche al training di IA ed al funzionamento di queste ultime, che ho scoperto essere incredibilmente simile a quello umano.",
  },
  {
    id: "hackathon",
    align: "left",
    image: {
      src: "/about/hackathon-winner.png",
      alt: "Claudia vincitrice di una challenge hackathon",
      variant: "portrait",
    },
    text: "Durante il mio percorso all'Apple Academy ho scoperto il mondo degli Hackathon, competizioni in cui si chiede a dei team di programmatori di costruire una soluzione ad un dato problema in 48 ore. Una full immersion in VSC non-stop, praticamente. Ho viaggiato per parteciparvi da Trieste fino a Stoccolma. Ad ottobre 2025 io ed il mio team ci portiamo a casa la vittoria giocando a Napoli, in casa, programmando “ReclutIA”, un'app che integra un famoso test personologico (il Big Five) con la selezione di personale per una banca italiana.",
  },
  {
    id: "languages",
    align: "right",
    image: {
      src: "/about/language-notes.png",
      alt: "Appunti di Claudia per lo studio delle lingue straniere",
      variant: "notes",
    },
    text: "Un altro pilastro della mia identità è l'amore per le lingue straniere: sono una poliglotta, al giorno d'oggi (2026) parlo sei lingue, continuandole a praticare sia in Academy che da sola. Ho iniziato da molto piccola, quando mia mamma già a tre anni, iniziò ad insegnarmi lo spagnolo grazie a dei videogiochi che l'istituto per bambini ispanofoni residenti in Italia della mia città metteva loro a disposizione. La mia lingua preferita? L'arabo.",
  },
];

const AboutPage = () => {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    const page = pageRef.current;
    if (!page) return;

    const elements = Array.from(page.querySelectorAll<HTMLElement>(".about-slide"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0.22 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main ref={pageRef} className="about-page">
      <Link className="about-back-link" to="/" aria-label="Torna alla homepage">
        CN
      </Link>

      <section className="about-hero about-section-intro" aria-labelledby="about-title">
        <div className="about-hero-collage about-slide" data-align="left">
          <div className="about-photo-card about-photo-child">
            <img className="about-photo" src="/about/child-computer.png" alt="Claudia da bambina al computer" />
          </div>
          <div className="about-photo-card about-photo-selfie">
            <img className="about-photo" src="/about/claudia-mirror.png" alt="Claudia Napolitano" />
          </div>
        </div>

        <div className="about-copy about-slide" data-align="right">
          <p className="about-eyebrow">About me</p>
          <h1 id="about-title">Claudia Napolitano</h1>
          <p>
            Mi chiamo Claudia Napolitano, sono una mobile developer italiana. Mi ritengo una persona abbastanza
            curiosa: mi è sempre piaciuto imparare e studiare in generale. Sono motivata dalle sfide complicate e mi
            piace migliorarmi ogni giorno.
          </p>
        </div>
      </section>

      <section className="about-story" aria-label="Percorso personale e professionale">
        {aboutBlocks.map((block, index) => {
          const isImageLeft = index % 2 !== 0;
          const imageAlign = isImageLeft ? "left" : "right";
          const copyAlign = isImageLeft ? "right" : "left";

          const rowClassName = `about-story-row ${
            isImageLeft ? "about-story-row-right" : "about-story-row-left"
          } ${block.id === "languages" ? "about-languages-row" : ""}`;

          const image = block.image ? (
            <img
              className={`about-story-image about-story-image-${block.image.variant ?? "square"} about-slide`}
              data-align={imageAlign}
              src={block.image.src}
              alt={block.image.alt}
              loading="lazy"
            />
          ) : (
            <div className="about-story-spacer" aria-hidden="true" />
          );

          const copy = (
            <div className="about-copy about-slide" data-align={copyAlign}>
              <p>{block.text}</p>
            </div>
          );

          return (
            <article className={rowClassName} key={block.id}>
              {isImageLeft ? (
                <>
                  {image}
                  {copy}
                </>
              ) : (
                <>
                  {copy}
                  {image}
                </>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default AboutPage;