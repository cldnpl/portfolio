import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import { useReveal } from "../hooks/useReveal";
import SplitWords from "./SplitWords";

export default function Manifesto() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].manifesto;
  const quote = useReveal<HTMLQuoteElement>({ threshold: 0.35 });
  const grid = useReveal<HTMLDivElement>({ threshold: 0.2 });

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

      <div className="a-manifesto__grid" ref={grid.ref}>
        {copy.items.map((item, i) => (
          <div
            key={item.num}
            className={`a-manifesto__item a-reveal ${grid.className}`}
            style={{ ["--reveal-delay" as string]: `${i * 140}ms` }}
          >
            <div className="a-manifesto__num">
              <span className="a-label a-label--gold">{item.num}</span>
              <span className="a-label">/</span>
              <span className="a-label a-label--bright">{item.label}</span>
            </div>
            <p className="a-body">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
