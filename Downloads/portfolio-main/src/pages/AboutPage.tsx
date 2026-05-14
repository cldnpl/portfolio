import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { publicAsset } from "@/lib/assets";

type AboutBlock = {
  id: "academy" | "psychology" | "hackathon" | "languages";
  align: "left" | "right";
  image?: {
    src: string;
    alt: string;
    variant?: "wide" | "portrait" | "square" | "notes";
  };
};

const aboutBlocks: AboutBlock[] = [
  {
    id: "academy",
    align: "left",
    image: {
      src: publicAsset("about/academy-group.jpg"),
      alt: "Claudia at the Apple Developer Academy community",
      variant: "wide",
    },
  },
  {
    id: "psychology",
    align: "right",
  },
  {
    id: "hackathon",
    align: "left",
    image: {
      src: publicAsset("about/hackathon-winner.png"),
      alt: "Claudia winning a hackathon challenge",
      variant: "portrait",
    },
  },
  {
    id: "languages",
    align: "right",
    image: {
      src: publicAsset("about/language-notes.png"),
      alt: "Claudia's notes for studying foreign languages",
      variant: "notes",
    },
  },
];

const AboutPage = () => {
  const pageRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const blockText: Record<AboutBlock["id"], string> = {
    academy: t.aboutAcademy,
    psychology: t.aboutPsychology,
    hackathon: t.aboutHackathon,
    languages: t.aboutLanguages,
  };

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
      <Link className="about-back-link" to="/" aria-label="Home">
        CN
      </Link>

      <section className="about-hero about-section-intro" aria-labelledby="about-title">
        <div className="about-hero-collage about-slide" data-align="left">
          <div className="about-photo-card about-photo-child">
            <img className="about-photo" src={publicAsset("about/child-computer.png")} alt="Claudia as a child at a computer" />
          </div>
          <div className="about-photo-card about-photo-selfie">
            <img className="about-photo" src={publicAsset("about/claudia-mirror.png")} alt="Claudia Napolitano" />
          </div>
        </div>

        <div className="about-copy about-slide" data-align="right">
          <p className="about-eyebrow">{t.aboutEyebrow}</p>
          <h1 id="about-title">{t.aboutTitle}</h1>
          <p>{t.aboutIntro}</p>
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
              <p>{blockText[block.id]}</p>
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
