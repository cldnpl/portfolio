import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import { SKILL_GROUPS, type SkillGroup } from "../skills";
import { useReveal } from "../hooks/useReveal";

/**
 * A capability chart, not a scorecard.
 *
 * The reference design used saturated gradient bars with the percentage
 * shouting in colour next to every row. Here the track is a hairline, the
 * fill is bronze, and the number sits small and quiet in the monospace used
 * for every other label on the page — the ranking is legible at a glance from
 * the bar lengths alone, which is the only job the number had.
 */
function Group({ group, position }: { group: SkillGroup; position: number }) {
  const { lang } = useLanguage();
  const { ref, className } = useReveal<HTMLDivElement>({ threshold: 0.25 });

  return (
    <div
      ref={ref}
      className={`a-skills__group a-reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${position * 130}ms` }}
    >
      <div className="a-skills__head">
        <span className="a-label a-label--gold">{group.index}</span>
        <span className="a-label">/</span>
        <span className="a-label a-label--bright">{group.title[lang]}</span>
      </div>

      <ul className="a-skills__list">
        {group.skills.map((skill, i) => (
          <li className="a-skill" key={skill.name}>
            <span className="a-skill__name">{skill.name}</span>
            <span className="a-skill__value">{skill.level}</span>
            <span className="a-skill__track">
              <i
                className="a-skill__fill"
                style={{
                  // The fill is only drawn once the group is in view, so the
                  // bars grow as the reader arrives rather than being already
                  // finished above the fold.
                  transform: `scaleX(${className ? skill.level / 100 : 0})`,
                  transitionDelay: `${position * 130 + 160 + i * 70}ms`,
                }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].skills;
  const head = useReveal<HTMLDivElement>({ threshold: 0.4 });

  return (
    <div className="a-skills">
      <div className="a-skills__intro a-reveal" ref={head.ref}>
        <span className={`a-label ${head.className}`}>{copy.eyebrow}</span>
      </div>

      <div className="a-skills__grid">
        {SKILL_GROUPS.map((group, i) => (
          <Group key={group.index} group={group} position={i} />
        ))}
      </div>
    </div>
  );
}
