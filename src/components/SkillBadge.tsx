import { useState } from "react";

interface SkillBadgeProps {
  name: string;
  level?: "Expert" | "Intermediate" | "Learning";
  index: number;
  variant?: "primary" | "accent";
}

const levelColors: Record<string, string> = {
  Expert: "text-primary",
  Intermediate: "text-accent",
  Learning: "text-muted-foreground",
};

const levelDots: Record<string, number> = {
  Expert: 3,
  Intermediate: 2,
  Learning: 1,
};

const SkillBadge = ({ name, level, index, variant = "primary" }: SkillBadgeProps) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isPrimary = variant === "primary";
  const dots = level ? levelDots[level] : 0;

  return (
    <div
      className={`
        relative group cursor-pointer select-none
        pixel-font text-[8px] md:text-[10px] lg:text-[11px]
        px-4 py-4 md:px-5 md:py-5
        border-2 
        flex flex-col items-center justify-center text-center gap-2
        transition-all duration-200 ease-out
        ${isPrimary
          ? "border-primary/30 text-primary bg-primary/5"
          : "border-accent/30 text-accent bg-accent/5"
        }
        ${hovered
          ? isPrimary
            ? "border-primary bg-primary/15 shadow-[0_0_25px_hsl(var(--primary)/0.35),inset_0_0_20px_hsl(var(--primary)/0.1)] -translate-y-0.5"
            : "border-accent bg-accent/15 shadow-[0_0_25px_hsl(var(--accent)/0.35),inset_0_0_20px_hsl(var(--accent)/0.1)] -translate-y-0.5"
          : ""
        }
        ${clicked ? "animate-[glitch_0.3s_ease-out]" : ""}
      `}
      style={{
        animation: `skillPop 0.5s ${index * 80}ms ease-out both`,
        minHeight: "64px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 400);
      }}
    >
      {/* Pixel corner decorations */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150 opacity-100" : "opacity-60"}`} />
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150 opacity-100" : "opacity-60"}`} />
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150 opacity-100" : "opacity-60"}`} />
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150 opacity-100" : "opacity-60"}`} />

      <span className="relative z-10 leading-relaxed">{name}</span>
      
      {level && (
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 transition-colors ${
                i < dots
                  ? isPrimary ? "bg-primary" : "bg-accent"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillBadge;
