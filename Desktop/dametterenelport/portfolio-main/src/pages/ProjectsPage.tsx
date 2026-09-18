import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";

const ProjectsPage = () => {
  const { t } = useLanguage();

  const projects = [
    {
      title: "Leggy",
      year: "2025",
      tag: t.leggyTag,
      description: t.leggyDescription,
      stack: [
        "Swift",
        "SwiftUI",
        "AVFoundation",
        "AVSpeechSynthesizer",
        "Accessibility API",
        "Combine",
      ],
      href: "https://github.com/cldnpl/Leggy",
    },
    {
      title: "ReclutIA",
      year: "2025",
      tag: t.reclutiaTag,
      description: t.reclutiaDescription,
      stack: [
        "Swift",
        "SwiftUI",
        "Combine",
        "URLSession",
        "Ollama (LLM locale)",
        "SwiftData",
        "Swift Charts",
      ],
    },
    {
      title: "StikAR",
      year: "2025",
      tag: t.stikarTag,
      description: t.stikarDescription,
      stack: [
        "Swift",
        "SwiftUI",
        "ARKit",
        "RealityKit",
        "PhotosUI",
        "Core Data",
        "Kotlin",
        "Jetpack Compose",
        "ARCore",
      ],
      href: "https://github.com/HoussamAW/AcademyGO",
    },
    {
      title: "Kram",
      year: "2025",
      tag: t.kramTag,
      description: t.kramDescription,
      stack: [
        "Swift",
        "SwiftUI",
        "URLSession",
        "Swift Concurrency (async/await)",
        "SwiftData",
        "MathJaxSwift / LaTeX",
      ],
    },
  ];

  return (
    <main className="projects-page">
      <Link className="about-back-link" to="/" aria-label="Home">
        CN
      </Link>

      <section className="projects-hero" aria-labelledby="projects-title">
        <p className="projects-eyebrow">{t.projectsEyebrow}</p>
        <h1 id="projects-title">{t.projectsTitle}</h1>
        <p className="projects-intro">{t.projectsIntro}</p>
      </section>

      <section className="projects-grid-section" aria-label="Projects list">
        <ul className="projects-grid">
          {projects.map((project) => (
            <li className="project-card" key={project.title}>
              <div className="project-card-head">
                <span className="project-card-year">{project.year}</span>
                <span className="project-card-tag">{project.tag}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <ul className="project-card-stack">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.href && (
                <a
                  className="project-card-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.projectsViewGithub}
                </a>
              )}
            </li>
          ))}
        </ul>

        <Link className="projects-back" to="/">
          {t.projectsBack}
        </Link>
      </section>
    </main>
  );
};

export default ProjectsPage;
