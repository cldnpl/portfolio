import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import { SKILL_GROUPS, type Skill, type SkillGroup } from "../skills";
import { useReveal } from "../hooks/useReveal";

const THIS_YEAR = new Date().getFullYear();

const plural = (n: number, [one, many]: [string, string]) => (n === 1 ? one : many);

/**
 * One bronze mark per project, so the bar is exactly as long as the skill has
 * been used: seven projects, seven marks. It used to be a bar filled to a
 * self-assessed percentage — "90" next to SwiftUI, a number nobody can check.
 */
function Row({ skill, delay }: { skill: Skill; delay: number }) {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].skills;
  const years = Math.max(1, THIS_YEAR - skill.since);

  return (
    <li className="a-skill" style={{ ["--tally-delay" as string]: `${delay}ms` }}>
      <span className="a-skill__name">{skill.name}</span>
      <span className="a-skill__meta">
        {`${years} ${plural(years, copy.year)}`}
        <span aria-hidden="true"> · </span>
        {`${skill.projects} ${plural(skill.projects, copy.project)}`}
      </span>
      <span className="a-skill__tally" aria-hidden="true">
        {Array.from({ length: skill.projects }, (_, i) => (
          <i key={i} className="a-tick" />
        ))}
      </span>
    </li>
  );
}

function Group({ group, position }: { group: SkillGroup; position: number }) {
  const { lang } = useLanguage();
  const { ref, className } = useReveal<HTMLDivElement>({ threshold: 0.2 });

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
          <Row key={skill.name} skill={skill} delay={position * 130 + 240 + i * 90} />
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
      <div className={`a-skills__intro a-reveal ${head.className}`} ref={head.ref}>
        <span className="a-label a-label--bright">{copy.eyebrow}</span>
      </div>

      <div className="a-skills__grid">
        {SKILL_GROUPS.map((group, i) => (
          <Group key={group.index} group={group} position={i} />
        ))}
      </div>
    </div>
  );
}
