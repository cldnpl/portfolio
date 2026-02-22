import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  name: string;
  level: number;
  delay?: number;
}

const SkillBar = ({ name, level, delay = 0 }: SkillBarProps) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="pixel-font text-[8px] md:text-[10px] text-foreground">{name}</span>
        <span className="pixel-font text-[7px] text-muted-foreground">{level}%</span>
      </div>
      <div className="h-4 border-2 border-primary/50 bg-muted">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${level}%` : "0%",
            transitionDelay: `${delay}ms`,
            background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
};

export default SkillBar;
