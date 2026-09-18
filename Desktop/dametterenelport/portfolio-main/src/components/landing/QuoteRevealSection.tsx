import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/language";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const QuoteRevealSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;

    let frame = 0;
    let active = false;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const viewportWidth = window.innerWidth || 1;
      const progress = clamp01((viewport - rect.top) / (rect.height + viewport * 0.1));
      const eased = easeOutCubic(progress);
      const horizontal = (1 - eased) * viewportWidth;

      copy.style.opacity = `${0.82 * eased}`;
      copy.style.transform = `translate3d(${horizontal}px, 0, 0)`;
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      if (active) {
        frame = requestAnimationFrame(update);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = Boolean(entry?.isIntersecting);
        if (active) {
          schedule();
          window.addEventListener("scroll", schedule, { passive: true });
          window.addEventListener("resize", schedule);
        } else {
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
          copy.style.opacity = "0";
          copy.style.transform = `translate3d(${window.innerWidth || 0}px, 0, 0)`;
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(section);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section ref={sectionRef} className="quote-reveal-section" aria-label="Bill Gates quote">
      <div className="quote-reveal-sticky">
        <div ref={copyRef} className="quote-reveal-copy">
          <p className="quote-reveal-text">{t.quoteLine1}</p>
          <p className="quote-reveal-text">{t.quoteLine2}</p>
          <p className="quote-reveal-author">{t.quoteAuthor}</p>
        </div>
      </div>
    </section>
  );
};

export default QuoteRevealSection;
