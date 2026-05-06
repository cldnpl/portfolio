import { useState } from "react";

const sections = ["About", "Skills", "Education", "Languages", "Projects", "Contact"];

const PixelNav = () => {
  const [active, setActive] = useState("About");

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-4 border-primary">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="pixel-font text-[10px] md:text-xs text-primary">
          {"< CN />"}
        </span>
        <div className="flex gap-2 md:gap-4">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className={`pixel-font text-[7px] md:text-[9px] uppercase tracking-wider px-2 py-1 transition-all
                ${active === s
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-primary"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PixelNav;
