import { useLanguage } from "@/lib/language";
import { homeCopy } from "../copy";
import { PROJECT_TOTAL, SKILL_GROUPS, type Skill, type SkillGroup } from "../skills";
import { useReveal } from "../hooks/useReveal";

const THIS_YEAR = new Date().getFullYear();

const plural = (n: number, [one, many]: [string, string]) => (n === 1 ? one : many);

/**
 * A ledger, not a scorecard.
 *
 * It used to be a bar per skill filled to a self-assessed percentage — "90"
 * next to SwiftUI, which is a number nobody can check and nobody believes.
 * Now every mark is a fact: one bronze mark per year of use, one cream mark per
 * project that used it. The row is read at a glance from its length, and the
 * line above it says exactly what the length is made of.
 */
function Tally({ years, projects }: { years: number; projects: number }) {
  return (
    <span className="a-skill__tally" aria-hidden="true">
      {Array.from({ length: years }, (_, i) => (
        <i key={`y${i}`} className="a-tick a-tick--year" />
      ))}
      {Array.from({ length: projects }, (_, i) => (
        <i key={`p${i}`} className="a-tick" />
      ))}
    </span>
  );
}

function Row({ skill, delay }: { skill: Skill; delay: number }) {
  const { lang } = useLanguage();
  const copy = homeCopy[lang].skills;
  const years = Math.max(0, THIS_YEAR - skill.since);
  const projects = skill.projects.length;

  return (
    <li className="a-skill" style={{ ["--tally-delay" as string]: `${delay}ms` }}>
      <span className="a-skill__name">{skill.name}</span>
      <span className="a-skill__meta">
        <span className="a-skill__years">
          {years > 0
            ? `${years} ${plural(years, copy.year)}`
            : `${copy.since} ${skill.since}`}
        </span>
        <span aria-hidden="true"> · </span>
        {`${projects} ${plural(projects, copy.project)}`}
      </span>
      <Tally years={years} projects={projects} />
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

        <div className="a-skills__key">
          <span className="a-skills__key-item a-label">
            <i className="a-tick a-tick--year" aria-hidden="true" />
            {copy.legendYear}
          </span>
          <span className="a-skills__key-item a-label">
            <i className="a-tick" aria-hidden="true" />
            {copy.legendProject}
          </span>
          <span className="a-skills__source a-label">
            {copy.source.replace("{n}", String(PROJECT_TOTAL))}
          </span>
        </div>
      </div>

      <div className="a-skills__grid">
        {SKILL_GROUPS.map((group, i) => (
          <Group key={group.index} group={group} position={i} />
        ))}
      </div>
    </div>
  );
}
