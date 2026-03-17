import PixelNav from "@/components/PixelNav";
import PixelAvatar from "@/components/PixelAvatar";
import PixelParticles from "@/components/PixelParticles";
import SkillBadge from "@/components/SkillBadge";
import AnimatedSection from "@/components/AnimatedSection";
import { Github, Mail, Phone, MapPin, Trophy, Linkedin, ExternalLink, Code2, Briefcase, Monitor, Server, Palette, Puzzle } from "lucide-react";

const skillCategories = [
  {
    label: "Frontend",
    icon: Monitor,
    skills: [
      { name: "Swift", level: "Expert" },
      { name: "SwiftUI", level: "Expert" },
      { name: "UIKit", level: "Expert" },
      { name: "HTML / CSS", level: "Intermediate" },
    ],
  },
  {
    label: "Backend",
    icon: Server,
    skills: [
      { name: "Firebase", level: "Expert" },
      { name: "REST APIs", level: "Expert" },
      { name: "Python", level: "Intermediate" },
      { name: "CoreData", level: "Expert" },
    ],
  },
  {
    label: "Design Tools",
    icon: Palette,
    skills: [
      { name: "Figma", level: "Intermediate" },
      { name: "Sketch", level: "Expert" },
      { name: "Procreate", level: "Expert" },
    ],
  },
  {
    label: "Soft Skills",
    icon: Puzzle,
    skills: [
      { name: "MVVM Architecture", level: "Expert" },
      { name: "Agile / Scrum", level: "Expert" },
      { name: "Accessibility", level: "Expert" },
      { name: "UX-Driven Design", level: "Expert" },
    ],
  },
];

const experiences = [
  {
    title: "iOS Developer",
    company: "Upwork",
    type: "Freelance",
    period: "Feb 2024 — Present",
    desc: "Building native iOS apps for international clients with Swift & SwiftUI.",
    emoji: "💼",
  },
  {
    title: "iOS Developer",
    company: "Venturelab",
    type: "Contract",
    period: "Sep 2025 — Jan 2026",
    desc: "Developed iOS features with SwiftUI for a Naples-based startup.",
    emoji: "🚀",
  },
  {
    title: "AI Trainer",
    company: "Mercor",
    type: "Part-time",
    period: "Dec 2025",
    desc: "Specialized red teaming for AI model training and safety.",
    emoji: "🤖",
  },
];

const languages = [
  { name: "Italian", level: "Native", emoji: "🇮🇹" },
  { name: "English", level: "Proficient", emoji: "🇬🇧" },
  { name: "Spanish", level: "Proficient", emoji: "🇪🇸" },
  { name: "Danish", level: "Proficient", emoji: "🇩🇰" },
  { name: "French", level: "Intermediate", emoji: "🇫🇷" },
  { name: "German", level: "Beginner", emoji: "🇩🇪" },
  { name: "Chinese", level: "Beginner", emoji: "🇨🇳" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background scanlines relative">
      <PixelParticles />
      <PixelNav />

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center space-y-6">
          <AnimatedSection>
            <div className="flex justify-center mb-6">
              <PixelAvatar />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <h1 className="pixel-font text-lg md:text-2xl lg:text-3xl text-foreground leading-relaxed">
              Claudia Napolitano
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <p className="pixel-font text-[9px] md:text-[11px] text-primary tracking-widest uppercase">
              iOS Developer · Swift & SwiftUI
            </p>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <div className="max-w-xl mx-auto space-y-3">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center">
                iOS Developer & Apple Developer Academy student, building native apps with
                <span className="text-primary"> Swift</span> and <span className="text-primary">SwiftUI</span>.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["MVVM Architecture", "Agile Methodology", "Accessibility", "UX-Driven", "Firebase / Backend"].map((tag) => (
                  <span key={tag} className="pixel-font text-[7px] md:text-[8px] px-3 py-1 border border-primary/40 text-primary/80 bg-primary/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={800}>
            <div className="flex gap-4 justify-center pt-4">
              <a
                href="https://github.com/cldnpl"
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn flex items-center gap-2"
              >
                <Github size={14} /> GitHub
              </a>
              <a
                href="mailto:napolitano.claudia@icloud.com"
                className="pixel-btn flex items-center gap-2"
                style={{
                  background: "transparent",
                  color: "hsl(var(--primary))",
                }}
              >
                <Mail size={14} /> Contact
              </a>
            </div>
          </AnimatedSection>

          {/* Scroll indicator */}
          <div className="pt-12">
            <div
              className="pixel-font text-[8px] text-muted-foreground"
              style={{ animation: "blink 1.5s infinite" }}
            >
              ▼ SCROLL DOWN ▼
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// ABOUT_ME"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="pixel-card space-y-4">
              <div className="flex items-start gap-3">
                <Code2 size={18} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="pixel-font text-[9px] text-accent mb-1">iOS DEVELOPER</p>
                  <p className="text-sm text-muted-foreground">
                    Building native iOS apps with Swift, SwiftUI, UIKit, CoreData, MapKit, and more.
                    Experienced with Firebase for backend services, server-side Swift logic, and REST APIs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy size={18} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="pixel-font text-[9px] text-accent mb-1">HACKATHON WINNER</p>
                  <p className="text-sm text-muted-foreground">
                    "The Big Hack: Smart Recruiting for Specialized Talent" — Oct 2025
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Based in Naples, Italy
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// SKILL_TREE"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((cat, catIdx) => (
              <AnimatedSection key={cat.label} delay={catIdx * 120}>
                <div className="pixel-card h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <cat.icon size={18} className="text-accent shrink-0" />
                    <h3 className="pixel-font text-[9px] md:text-[10px] text-accent tracking-wider">
                      {cat.label.toUpperCase()}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {cat.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between group">
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          {skill.name}
                        </span>
                        <span className={`pixel-font text-[7px] px-2 py-0.5 border ${
                          skill.level === "Expert"
                            ? "border-primary/50 text-primary bg-primary/10"
                            : skill.level === "Intermediate"
                            ? "border-accent/50 text-accent bg-accent/10"
                            : "border-muted-foreground/30 text-muted-foreground bg-muted/50"
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// EXPERIENCE"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <AnimatedSection key={exp.company} delay={i * 150}>
                <div className="pixel-card flex items-start gap-4">
                  <div
                    className="text-xl mt-1"
                    style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}
                  >
                    {exp.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="pixel-font text-[9px] md:text-[10px] text-foreground">{exp.title}</h3>
                      <span className="pixel-font text-[7px] px-2 py-0.5 border border-primary/40 text-primary/80 bg-primary/5">
                        {exp.type}
                      </span>
                    </div>
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Briefcase size={12} /> {exp.company}
                    </p>
                    <p className="pixel-font text-[7px] text-muted-foreground mt-1">{exp.period}</p>
                    <p className="text-xs text-muted-foreground mt-2">{exp.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      <section id="education" className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// EDUCATION"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <div className="space-y-4">
            {[
              {
                title: "Apple Developer Academy",
                sub: "2025 / 2026",
                desc: "Full program — Naples",
              },
              {
                title: "Apple Foundation Academy",
                sub: "Nov — Dec 2024",
                desc: "Foundation program — Naples",
              },
              {
                title: "B.Sc. Psychological Sciences",
                sub: "University of Naples Federico II",
                desc: "Expected graduation: 2026",
              },
              {
                title: "Scientific High School Diploma",
                sub: "2023 — Italy",
                desc: "",
              },
            ].map((edu, i) => (
              <AnimatedSection key={edu.title} delay={i * 150}>
                <div className="pixel-card flex items-start gap-4">
                  <div
                    className="pixel-font text-lg mt-1"
                    style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.5}s` }}
                  >
                    {i === 0 ? "🍎" : i === 1 ? "📱" : i === 2 ? "🧠" : "🎓"}
                  </div>
                  <div>
                    <h3 className="pixel-font text-[9px] md:text-[10px] text-foreground mb-1">{edu.title}</h3>
                    {edu.sub && <p className="text-xs text-primary">{edu.sub}</p>}
                    {edu.desc && <p className="text-xs text-muted-foreground mt-1">{edu.desc}</p>}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="languages" className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// LANGUAGE_SKILLS"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {languages.map((lang, i) => (
              <AnimatedSection key={lang.name} delay={i * 100}>
                <div className="pixel-card text-center group cursor-default">
                  <div
                    className="text-2xl mb-2 transition-transform group-hover:scale-125"
                    style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
                  >
                    {lang.emoji}
                  </div>
                  <p className="pixel-font text-[8px] text-foreground">{lang.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{lang.level}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// PROJECTS"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "DyslexiaApp", lang: "Swift · SwiftUI", emoji: "📖", desc: "iOS accessibility app for dyslexia support" },
              { name: "accTourismGood", lang: "Swift · MapKit", emoji: "♿", desc: "Accessible tourism iOS experience" },
              { name: "tourismHackathon", lang: "Swift · UIKit", emoji: "🏆", desc: "Hackathon-winning tourism iOS app" },
              { name: "The-Site-Accessible-Route-Navigator", lang: "Swift · CoreLocation", emoji: "🗺️", desc: "Accessible route navigation for iOS" },
              { name: "BuyMeAPie", lang: "Swift · CoreData", emoji: "🥧", desc: "Native iOS shopping list app" },
              { name: "Kram", lang: "Swift · SwiftUI", emoji: "🧮", desc: "Math learning startup app" },
            ].map((project, i) => (
              <AnimatedSection key={project.name} delay={i * 100}>
                <a
                  href={`https://github.com/cldnpl/${project.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-card flex items-start gap-4 group cursor-pointer hover:border-primary transition-colors"
                >
                  <div
                    className="text-xl mt-1"
                    style={{ animation: "float 3s ease-in-out infinite", animationDelay: `${i * 0.3}s` }}
                  >
                    {project.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="pixel-font text-[8px] md:text-[9px] text-foreground group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h3>
                      <ExternalLink size={12} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{project.desc}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Code2 size={10} className="text-accent" />
                      <span className="pixel-font text-[7px] text-accent">{project.lang}</span>
                    </div>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative z-10 py-20 px-4 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="pixel-font text-sm md:text-base text-primary mb-2">
              {"// CONNECT"}
            </h2>
            <div className="pixel-divider mb-8" />
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="pixel-card inline-block">
              <div className="space-y-3 text-left">
                <a
                  href="mailto:napolitano.claudia@icloud.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail size={16} className="text-primary" />
                  napolitano.claudia@icloud.com
                </a>
                <a
                  href="tel:+393911846768"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone size={16} className="text-primary" />
                  +39 391 1846768
                </a>
                <a
                  href="https://github.com/cldnpl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github size={16} className="text-primary" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/claudia-napolitano-1660b533a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin size={16} className="text-primary" />
                  LinkedIn
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="text-primary" />
                  Italy
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <p
              className="pixel-font text-[8px] text-muted-foreground mt-12"
              style={{ animation: "blink 2s infinite" }}
            >
              GOT AN IDEA? LET'S BUILD IT TOGETHER_
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
