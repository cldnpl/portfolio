import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import { useCountUp } from "../hooks/useCountUp";
import { useReveal } from "../hooks/useReveal";

function Stat({
  value,
  label,
  gold,
  suffix,
  active,
  delay,
}: {
  value: string;
  label: string;
  gold?: boolean;
  suffix?: string;
  active: boolean;
  delay: number;
}) {
  const { display, settled } = useCountUp(value, active);

  return (
    <div
      className={`a-stat ${gold ? "a-stat--gold" : ""} a-reveal ${active ? "is-in" : ""}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms`, ["--reveal-y" as string]: "22px" }}
    >
      <span className="a-stat__value">
        {display}
        {/* The honours only make sense once the mark has finished landing. */}
        {suffix ? (
          <em className={`a-stat__suffix ${settled ? "is-in" : ""}`}>{suffix}</em>
        ) : null}
      </span>
      <span className="a-label a-stat__label">{label}</span>
    </div>
  );
}

export default function StatsStrip() {
  const { lang } = useLanguage();
  const stats = homeCopy[lang].stats;
  const { ref, shown } = useReveal<HTMLDivElement>({ threshold: 0.4 });

  return (
    <div className="a-stats" ref={ref}>
      {stats.map((stat, i) => (
        <Stat key={stat.label} {...stat} active={shown} delay={i * 110} />
      ))}
    </div>
  );
}
