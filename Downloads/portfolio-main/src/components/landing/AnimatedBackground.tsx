import { useState } from "react";

const BACKGROUND_GIF = "/backgrounds/purple-animated-waves.gif";
const BACKGROUND_POSTER = "/backgrounds/site-background.jpg";

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
          onError={() => setMediaMode("poster")}
        />
      )}

      {mediaMode === "poster" && <img className="animated-background-media" src={BACKGROUND_POSTER} alt="" />}
      <div className="background-dim" />
    </div>
  );
};

export default AnimatedBackground;
