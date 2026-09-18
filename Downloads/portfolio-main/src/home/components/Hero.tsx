import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import SplitWords from "./SplitWords";

/**
 * The name rises letter-block by letter-block, the rules draw themselves in,
 * and the body copy fades last. Everything is on one timeline so the hero
 * resolves as a single gesture rather than four separate animations.
 */
export default function Hero() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].hero;
  const [ready, setReady] = useState(false);

  // One frame after mount, so the browser has the fonts laid out first.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  // Re-run the entrance when the language changes — the words are different,
  // so replaying the reveal is honest rather than decorative.
  useEffect(() => {
    setReady(false);
    const id = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(id);
  }, [lang]);

  const state = ready ? "is-in" : "";

  return (
    <section className="a-hero" id="top">
      <div className={`a-hero__meta a-reveal ${state}`} style={{ ["--reveal-delay" as string]: "80ms" }}>
        <span className="a-label">{copy.metaLeft}</span>
        <span className="a-label">{copy.metaRight}</span>
      </div>

      <div className="a-hero__center">
        <h1 className={`a-hero__name ${state}`} aria-label={copy.nameLines.join(" ")}>
          {copy.nameLines.map((line, i) => (
            <span className="a-line" key={line} aria-hidden="true">
              <SplitWords text={line} delay={260 + i * 130} stagger={70} />
            </span>
          ))}
        </h1>

        {/* One hairline, one line of type. Nothing else earns its place here. */}
        <span
          className={`a-hero__mark a-reveal-rule ${state}`}
          style={{ ["--reveal-delay" as string]: "700ms" }}
          aria-hidden="true"
        />

        <p className={`a-hero__tagline ${state}`} aria-label={copy.tagline}>
          <span aria-hidden="true">
            {copy.tagline.split(/(\s&\s)/).map((part, i) =>
              part === " & " ? (
                <span className="a-hero__amp" key="amp">
                  {" & "}
                </span>
              ) : (
                <SplitWords key={i} text={part} delay={820 + i * 60} stagger={52} />
              )
            )}
          </span>
        </p>
      </div>

      <div
        className={`a-hero__cue a-reveal ${state}`}
        style={{ ["--reveal-delay" as string]: "1400ms" }}
        aria-hidden="true"
      >
        <span className="a-hero__cue-line" />
        <span className="a-label">{copy.cue}</span>
      </div>
    </section>
  );
}
