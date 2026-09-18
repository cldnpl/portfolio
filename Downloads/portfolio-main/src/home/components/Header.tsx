import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { useScrollFlag } from "../hooks/useScrollFlag";
import { GITHUB_URL, homeCopy } from "../copy";

export default function Header() {
  const { lang, setLang } = useLanguage();
  const copy = homeCopy[lang];
  const stuck = useScrollFlag(40);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  // Lock the page while the drawer is open.
  //
  // `overflow: hidden` alone is not enough: several mobile browsers drop the
  // scroll offset when the body stops scrolling, so closing the menu dumps the
  // reader back at the top of the page. Pinning the body at its current offset
  // and restoring it afterwards keeps their place.
  useEffect(() => {
    if (!open) return;

    const y = window.scrollY;
    const style = document.body.style;
    const previous = {
      position: style.position,
      top: style.top,
      width: style.width,
      overflow: style.overflow,
    };

    style.position = "fixed";
    style.top = `-${y}px`;
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.width = previous.width;
      style.overflow = previous.overflow;
      window.scrollTo(0, y);
    };
  }, [open]);

  // "Work" and "Contact" are anchors on the home page and destinations
  // everywhere else, so the same nav item does the right thing on both.
  const scrollTo = (id: string) => {
    setOpen(false);
    if (!onHome) {
      navigate(id === "work" ? "/projects" : "/#contact");
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = (
    <>
      <button className="a-nav__link" onClick={() => scrollTo("work")}>
        {copy.nav.work}
      </button>
      <Link className="a-nav__link" to="/about" onClick={() => setOpen(false)}>
        {copy.nav.about}
      </Link>
      <button className="a-nav__link" onClick={() => scrollTo("contact")}>
        {copy.nav.contact}
      </button>
      <a
        className="a-nav__link a-nav__link--muted"
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        {copy.nav.github}
      </a>
    </>
  );

  return (
    <>
      <header className={`a-header ${stuck ? "is-stuck" : ""}`}>
        <Link to="/" className="a-wordmark" aria-label="Claudia Napolitano">
          <span className="a-wordmark__name">Claudia Napolitano</span>
          <span className="a-wordmark__role">{copy.role}</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.25rem, 3vw, 2.75rem)" }}>
          <nav className="a-nav">{links}</nav>

          <div className="a-lang" role="group" aria-label={copy.a11y.language}>
            <span
              className="a-lang__thumb"
              style={{ transform: `translateX(${lang === "en" ? 0 : 100}%)` }}
            />
            <button
              className={`a-lang__btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              className={`a-lang__btn ${lang === "it" ? "is-active" : ""}`}
              onClick={() => setLang("it")}
              aria-pressed={lang === "it"}
            >
              IT
            </button>
          </div>

          <button
            className={`a-burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={copy.a11y.menu}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`a-drawer ${open ? "is-open" : ""}`}>
        <button className="a-drawer__link" onClick={() => scrollTo("work")}>
          {copy.nav.work}
        </button>
        <Link className="a-drawer__link" to="/about" onClick={() => setOpen(false)}>
          {copy.nav.about}
        </Link>
        <button className="a-drawer__link" onClick={() => scrollTo("contact")}>
          {copy.nav.contact}
        </button>
        <a className="a-drawer__link" href={GITHUB_URL} target="_blank" rel="noreferrer">
          {copy.nav.github}
        </a>
      </div>
    </>
  );
}
