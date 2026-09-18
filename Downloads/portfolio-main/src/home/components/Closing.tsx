import { useLanguage } from "@/lib/language";
import { CONTACT_EMAIL, GITHUB_URL, homeCopy } from "../copy";
import { useReveal } from "../hooks/useReveal";
import SplitWords from "./SplitWords";

export default function Closing() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang];
  const line = useReveal<HTMLParagraphElement>({ threshold: 0.4 });
  const cta = useReveal<HTMLDivElement>({ threshold: 0.5 });

  return (
    <>
      <section className="a-closing" id="contact">
        <p ref={line.ref} className={`a-closing__line ${line.className}`} aria-label={copy.closing.line}>
          <span aria-hidden="true">
            <SplitWords text={copy.closing.line} stagger={48} />
          </span>
        </p>

        <div ref={cta.ref} className={`a-reveal ${cta.className}`} style={{ ["--reveal-delay" as string]: "220ms" }}>
          <a className="a-closing__mail" href={`mailto:${CONTACT_EMAIL}`}>
            {copy.closing.mail}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer className="a-footer">
        <span className="a-label">{copy.footer.left}</span>
        <a className="a-label" href={GITHUB_URL} target="_blank" rel="noreferrer">
          {copy.nav.github}
        </a>
        <span className="a-label">{copy.footer.right}</span>
      </footer>
    </>
  );
}
