import { useEffect } from "react";
import "@/styles/atelier.css";
import { useLanguage } from "@/lib/language";
import { publicAsset } from "@/lib/assets";
import Header from "@/home/components/Header";
import MarbleBackdrop from "@/home/components/MarbleBackdrop";
import SplitWords from "@/home/components/SplitWords";
import { useReveal } from "@/home/hooks/useReveal";
import { PHOTOS, aboutCopy, type PhotoKey } from "./copy";

/**
 * One photograph, or the space one will occupy. The frame is the same object
 * either way — a hairline window on the stone — so filling it later changes
 * the picture and nothing about the layout.
 */
function Frame({ photo, delay = 0 }: { photo: PhotoKey; delay?: number }) {
  const { lang } = useLanguage();
  const copy = aboutCopy[lang];
  const { src, ratio } = PHOTOS[photo];
  const { ref, className } = useReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <figure
      ref={ref}
      className={`a-frame a-frame--${ratio} a-reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      <div className="a-frame__box">
        {src ? (
          <img
            className="a-frame__image"
            src={publicAsset(src)}
            alt={copy.alt[photo]}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="a-frame__pending a-label">{copy.pending}</span>
        )}
      </div>
      <figcaption className="a-label a-frame__caption">{copy.captions[photo]}</figcaption>
    </figure>
  );
}

/** A long-form chapter: one frame, one column of prose, optional tags. */
function Chapter({
  chapter,
  photo,
  reverse = false,
}: {
  chapter: { eyebrow: string; title: string; body: string[]; tags?: { label: string; strong?: boolean }[] };
  photo: PhotoKey;
  reverse?: boolean;
}) {
  const { ref, className } = useReveal<HTMLDivElement>({ threshold: 0.18 });

  return (
    <section className={`a-about__chapter ${reverse ? "is-reverse" : ""}`}>
      <Frame photo={photo} delay={reverse ? 120 : 0} />

      <div className={`a-about__chapter-text a-reveal ${className}`} ref={ref}>
        <span className="a-label a-label--gold">{chapter.eyebrow}</span>
        <h2 className="a-about__heading">{chapter.title}</h2>
        {chapter.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="a-body a-about__paragraph">
            {paragraph}
          </p>
        ))}

        {chapter.tags ? (
          <ul className="a-about__tags">
            {chapter.tags.map((tag) => (
              <li key={tag.label} className={`a-chip ${tag.strong ? "a-chip--strong" : ""}`}>
                {tag.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { lang } = useLanguage();
  const copy = aboutCopy[lang];
  const head = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const columns = useReveal<HTMLDivElement>({ threshold: 0.2 });

  useEffect(() => {
    const body = document.body.style;
    const root = document.documentElement.style;
    const previousBackground = body.background;
    const previousBehaviour = root.scrollBehavior;

    body.background = "#0a0806";
    root.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    return () => {
      body.background = previousBackground;
      root.scrollBehavior = previousBehaviour;
    };
  }, []);

  return (
    <div className="atelier">
      <MarbleBackdrop />
      <Header />

      <main className="a-about">
        <section className="a-about__head">
          <div className="a-about__head-text" ref={head.ref}>
            <span className={`a-label a-reveal ${head.className}`}>{copy.eyebrow}</span>

            <h1 className={`a-about__title ${head.className}`} aria-label={copy.name}>
              <span aria-hidden="true">
                <SplitWords text={copy.name} delay={140} />
              </span>
            </h1>

            <p
              className={`a-body a-about__intro a-reveal ${head.className}`}
              style={{ ["--reveal-delay" as string]: "420ms" }}
            >
              {copy.intro}
            </p>
          </div>

          {/* Two frames, the second lifted: a pair set on the same line would
              read as a gallery strip rather than as part of the page. */}
          <div className="a-about__portraits">
            <Frame photo="portrait" delay={200} />
            <Frame photo="academy" delay={320} />
          </div>
        </section>

        <hr className="a-rule a-about__rule" />

        <div className="a-about__columns" ref={columns.ref}>
          {copy.columns.map((column, i) => (
            <div
              key={column.eyebrow}
              className={`a-about__column a-reveal ${columns.className}`}
              style={{ ["--reveal-delay" as string]: `${i * 140}ms` }}
            >
              <span className="a-label">{column.eyebrow}</span>
              <p className="a-body a-about__paragraph">{column.body}</p>
            </div>
          ))}
        </div>

        <Chapter chapter={copy.academy} photo="hackathon" />
        <Chapter chapter={copy.languages} photo="languages" reverse />
      </main>
    </div>
  );
}
