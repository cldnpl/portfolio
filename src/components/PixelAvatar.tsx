import { useEffect, useState } from "react";

const PixelAvatar = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => (f + 1) % 2), 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40">
      <div
        className="w-full h-full pixel-border-accent"
        style={{
          background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
          imageRendering: "pixelated",
        }}
      >
        <div className="w-full h-full flex items-center justify-center pixel-font text-4xl md:text-5xl">
          {frame === 0 ? "👩‍💻" : "✨"}
        </div>
      </div>
      {/* Pixel decoration dots */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent" style={{ animation: "blink 1s infinite" }} />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary" style={{ animation: "blink 1.5s infinite" }} />
    </div>
  );
};

export default PixelAvatar;
