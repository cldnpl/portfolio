import { useState } from "react";

interface SkillBadgeProps {
  name: string;
  index: number;
  variant?: "primary" | "accent";
}

const SkillBadge = ({ name, index, variant = "primary" }: SkillBadgeProps) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isPrimary = variant === "primary";

  return (
    <div
      className={`
        relative group cursor-pointer select-none
        pixel-font text-[9px] md:text-[11px] lg:text-[12px]
        px-5 py-4 md:px-6 md:py-5
        border-2 text-center
        transition-all duration-300 ease-out
        ${isPrimary
          ? "border-primary/30 text-primary bg-primary/5"
          : "border-accent/30 text-accent bg-accent/5"
        }
        ${hovered
          ? isPrimary
            ? "border-primary bg-primary/15 shadow-[0_0_25px_hsl(var(--primary)/0.35),inset_0_0_20px_hsl(var(--primary)/0.1)] -translate-y-1"
            : "border-accent bg-accent/15 shadow-[0_0_25px_hsl(var(--accent)/0.35),inset_0_0_20px_hsl(var(--accent)/0.1)] -translate-y-1"
          : ""
        }
        ${clicked ? "animate-[glitch_0.3s_ease-out]" : ""}
      `}
      style={{
        animation: `skillPop 0.5s ${index * 100}ms ease-out both`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 400);
      }}
    >
      {/* Pixel corner decorations */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150" : ""}`} />
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150" : ""}`} />
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150" : ""}`} />
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 ${isPrimary ? "bg-primary/60" : "bg-accent/60"} transition-all duration-300 ${hovered ? "scale-150" : ""}`} />

      {/* Scanline on hover */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${isPrimary ? "hsl(var(--primary))" : "hsl(var(--accent))"} 2px, transparent 4px)`,
            animation: "scanMove 2s linear infinite",
          }}
        />
      )}

      <span className="relative z-10">{name}</span>
    </div>
  );
};

export default SkillBadge;
