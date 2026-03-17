import { useState } from "react";

interface SkillBadgeProps {
  name: string;
  index: number;
  variant?: "primary" | "accent";
}

const SkillBadge = ({ name, index, variant = "primary" }: SkillBadgeProps) => {
  const [clicked, setClicked] = useState(false);

  const isPrimary = variant === "primary";

  return (
    <span
      className={`
        pixel-font text-[8px] md:text-[9px] px-4 py-2.5
        border-2 cursor-pointer select-none
        transition-all duration-300 ease-out
        inline-block
        ${isPrimary
          ? "border-primary/40 text-primary bg-primary/5 hover:bg-primary/20 hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.4)] hover:scale-110"
          : "border-accent/40 text-accent bg-accent/5 hover:bg-accent/20 hover:border-accent hover:shadow-[0_0_15px_hsl(var(--accent)/0.4)] hover:scale-110"
        }
        ${clicked
          ? isPrimary
            ? "animate-[glitch_0.3s_ease-out] bg-primary/25 border-primary"
            : "animate-[glitch_0.3s_ease-out] bg-accent/25 border-accent"
          : ""
        }
      `}
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: "both",
        animation: `skillPop 0.4s ${index * 80}ms ease-out both`,
      }}
      onClick={() => {
        setClicked(true);
        setTimeout(() => setClicked(false), 400);
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = `scale(1.1) rotate(${Math.random() > 0.5 ? 2 : -2}deg)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) rotate(0deg)";
      }}
    >
      {name}
    </span>
  );
};

export default SkillBadge;
