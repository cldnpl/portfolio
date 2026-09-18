import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import { useReveal } from "../hooks/useReveal";
import SplitWords from "./SplitWords";
import Skills from "./Skills";

export default function Manifesto() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].manifesto;
  const quote = useReveal<HTMLQuoteElement>({ threshold: 0.35 });

  return (
    <section className="a-manifesto">
      <blockquote
        ref={quote.ref}
        className={`a-manifesto__quote ${quote.className}`}
        aria-label={copy.quote}
      >
        <span aria-hidden="true">
          <SplitWords text={copy.quote} stagger={46} />
        </span>
      </blockquote>

      <Skills />

    </section>
  );
}
