import { useState } from "react";
import { publicAsset } from "@/lib/assets";

const BACKGROUND_GIF = publicAsset("backgrounds/purple-animated-waves.gif");
const BACKGROUND_POSTER = publicAsset("backgrounds/background.jpg");

type MediaMode = "gif" | "poster";

const AnimatedBackground = () => {
  const [mediaMode, setMediaMode] = useState<MediaMode>("gif");

  return (
    <div className="animated-background" aria-hidden="true">
      {mediaMode === "gif" && (
        <img
          className="animated-background-media"
          src={BACKGROUND_GIF}
          alt=""
          loading="lazy"
          onError={() => setMediaMode("poster")}
        />
      )}

      {mediaMode === "poster" && (
        <img className="animated-background-media" src={BACKGROUND_POSTER} alt="" loading="lazy" />
      )}
      <div className="background-dim" />
    </div>
  );
};

export default AnimatedBackground;
