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

  // Contact is an anchor on the home page and a destination everywhere else,
  // so the one nav item does the right thing on both.
  //
  // Projects is not like that: it is always the index at /projects. It used to
  // scroll to id="work" while on the home page, but that id belongs to the
  // device stage — so the reader asking for the projects got the three
  // spinning phones instead of the work.
  const goToContact = () => {
    setOpen(false);
    if (!onHome) {
      navigate("/#contact");
      return;
    }
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const links = (
    <>
      <Link className="a-nav__link" to="/projects" onClick={() => setOpen(false)}>
        {copy.nav.work}
      </Link>
      <Link className="a-nav__link" to="/about" onClick={() => setOpen(false)}>
        {copy.nav.about}
      </Link>
      <button className="a-nav__link" onClick={goToContact}>
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
        <Link className="a-drawer__link" to="/projects" onClick={() => setOpen(false)}>
          {copy.nav.work}
        </Link>
        <Link className="a-drawer__link" to="/about" onClick={() => setOpen(false)}>
          {copy.nav.about}
        </Link>
        <button className="a-drawer__link" onClick={goToContact}>
          {copy.nav.contact}
        </button>
        <a className="a-drawer__link" href={GITHUB_URL} target="_blank" rel="noreferrer">
          {copy.nav.github}
        </a>
      </div>
    </>
  );
}
