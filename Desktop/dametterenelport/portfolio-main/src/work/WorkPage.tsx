import { useEffect } from "react";
import "@/styles/atelier.css";
import { useLanguage } from "@/lib/language";
import { publicAsset } from "@/lib/assets";
import Header from "@/home/components/Header";
import MarbleBackdrop from "@/home/components/MarbleBackdrop";
import SplitWords from "@/home/components/SplitWords";
import { useReveal } from "@/home/hooks/useReveal";
import { PROJECTS, type Platform, type Project, type Shot } from "./projects";

const PLATFORM_LABEL: Record<Platform, string> = {
  ios: "iOS",
  android: "Android",
  visionos: "visionOS",
};

const COPY = {
  en: {
    eyebrow: (n: number) => `Index — ${n} projects`,
    title: "Work",
    intro:
      "Native apps built at the Apple Developer Academy, in hackathon rooms, and at my own desk at two in the morning. Every screen below is a capture from the running app, not a mockup.",
    repo: "Repository",
    pending: "Capture pending",
  },
  it: {
    eyebrow: (n: number) => `Indice — ${n} progetti`,
    title: "Lavori",
    intro:
      "App native costruite all'Apple Developer Academy, nelle stanze degli hackathon e alla mia scrivania alle due di notte. Ogni schermata qui sotto è una cattura dall'app in esecuzione, non un mockup.",
    repo: "Repository",
    pending: "Cattura in arrivo",
  },
};

/** A phone or headset window holding one real capture. */
function DeviceShot({ shot, pending }: { shot: Shot; pending: string }) {
  const isSpatial = shot.platform === "visionos";

  return (
    <figure className={`a-shot ${isSpatial ? "a-shot--spatial" : ""}`}>
      <div className="a-shot__frame">
        {shot.src ? (
          <img
            className="a-shot__image"
            src={publicAsset(shot.src)}
            alt={shot.caption}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="a-shot__pending a-label">{pending}</span>
        )}
      </div>
      <figcaption className="a-label a-shot__caption">
        {PLATFORM_LABEL[shot.platform]}
      </figcaption>
    </figure>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { lang } = useLanguage();
  const copy = COPY[lang];
  const { ref, className } = useReveal<HTMLElement>({ threshold: 0.12 });

  return (
    <article
      ref={ref}
      className={`a-project a-reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${(index % 3) * 110}ms` }}
    >
      <header className="a-project__head">
        <span className="a-label a-label--bright">
          {String(index + 1).padStart(2, "0")} — {project.name}
        </span>
        <span className="a-label">{project.year}</span>
      </header>

      <div className={`a-project__shots ${project.shots.length > 1 ? "is-pair" : ""}`}>
        {project.shots.map((shot) => (
          <DeviceShot key={`${project.slug}-${shot.platform}`} shot={shot} pending={copy.pending} />
        ))}
      </div>

      <p className="a-body a-project__summary">{project.summary[lang]}</p>

      <ul className="a-project__stack">
        {project.stack.map((item) => (
          <li key={item} className="a-chip">
            {item}
          </li>
        ))}
      </ul>

      {/* The case-study link lands here once the detail page exists; until
          then the card shows no affordance it cannot honour. */}
      {project.repo ? (
        <div className="a-project__links">
          <a className="a-project__link" href={project.repo} target="_blank" rel="noreferrer">
            {copy.repo} <span aria-hidden="true">→</span>
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function WorkPage() {
  const { lang } = useLanguage();
  const copy = COPY[lang];
  const head = useReveal<HTMLDivElement>({ threshold: 0.2 });

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

      <main className="a-work">
        <div className="a-work__head" ref={head.ref}>
          <span className={`a-label a-reveal ${head.className}`}>
            {copy.eyebrow(PROJECTS.length)}
          </span>

          <h1 className={`a-work__title ${head.className}`} aria-label={copy.title}>
            <span aria-hidden="true">
              <SplitWords text={copy.title} delay={140} />
            </span>
          </h1>

          <p
            className={`a-body a-work__intro a-reveal ${head.className}`}
            style={{ ["--reveal-delay" as string]: "420ms" }}
          >
            {copy.intro}
          </p>
        </div>

        <div className="a-work__grid">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
