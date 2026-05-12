import AnimatedBackground from "@/components/landing/AnimatedBackground";
import IPhoneScrollScene from "@/components/landing/IPhoneScrollScene";
import NameModelHero from "@/components/landing/NameModelHero";
import QuoteRevealSection from "@/components/landing/QuoteRevealSection";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage, type Lang } from "@/lib/language";

const LANG_OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: "it", label: "Italiano", native: "IT" },
  { code: "en", label: "English", native: "EN" },
];

const Index = () => {
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    // Use `click` (after the button's own onClick has already fired) instead of
    // `mousedown`, so we never race with the dropdown option's own handler.
    const handleClick = (event: MouseEvent) => {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLangOpen(false);
    };
    // Defer the listener so the click that opened the popup doesn't immediately
    // close it.
    const timer = window.setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 0);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [langOpen]);

  const currentLang = LANG_OPTIONS.find((option) => option.code === lang) ?? LANG_OPTIONS[0];

  return (
    <main className="portfolio-landing">
      <AnimatedBackground />

      <header className="portfolio-nav">
        <a href="#top" className="portfolio-mark" aria-label="Claudia Napolitano home">
          CN
        </a>

        <nav className="portfolio-links" aria-label="Primary">
          <Link to="/projects">{t.navProjects}</Link>
          <Link to="/about">{t.navAbout}</Link>
          <a href="mailto:claudia.napolitano@gmail.com">{t.navContact}</a>
          <a href="https://github.com/cldnpl" target="_blank" rel="noreferrer">
            Github
          </a>
          <a href="https://www.linkedin.com/in/claudia-napolitano/" target="_blank" rel="noreferrer">
            Linkedin
          </a>
          <div className="portfolio-lang-wrapper" ref={langRef}>
            <button
              type="button"
              className="portfolio-lang"
              onClick={() => setLangOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={lang === "it" ? "Cambia lingua" : "Change language"}
            >
              <span>{currentLang.native}</span>
              <span className={`portfolio-lang-chevron${langOpen ? " is-open" : ""}`} aria-hidden="true">
                ▾
              </span>
            </button>
            {langOpen && (
              <div className="portfolio-lang-menu" role="listbox">
                {LANG_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    className={`portfolio-lang-option${
                      option.code === lang ? " is-current" : ""
                    }`}
                    role="option"
                    aria-selected={option.code === lang}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setLang(option.code);
                      setLangOpen(false);
                    }}
                  >
                    <span className="portfolio-lang-option-code">{option.native}</span>
                    <span className="portfolio-lang-option-label">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      <section id="top" className="hero-section" aria-label="Claudia Napolitano portfolio">
        <div className="hero-content">
          <NameModelHero />
        </div>
      </section>

      <QuoteRevealSection />

      <section id="projects">
        <IPhoneScrollScene />
      </section>

      <section id="about" className="portfolio-anchor" aria-hidden="true" />
      <section id="contact" className="portfolio-anchor" aria-hidden="true" />
    </main>
  );
};

export default Index;
