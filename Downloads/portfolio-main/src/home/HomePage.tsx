import { useEffect } from "react";
import "@/styles/atelier.css";
import Closing from "./components/Closing";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import MarbleBackdrop from "./components/MarbleBackdrop";
import PlatformStage from "./components/PlatformStage";
import StatsStrip from "./components/StatsStrip";

export default function HomePage() {
  // The page owns the dark surface; other routes keep their own styling.
  //
  // It also turns off the global `scroll-behavior: smooth`. On a page this
  // long that rule animates every wheel tick, so the view keeps gliding after
  // the reader has stopped — which reads as lag, and as the page sliding back
  // on its own. Anchor jumps still pass `behavior: "smooth"` explicitly.
  useEffect(() => {
    const body = document.body.style;
    const root = document.documentElement.style;
    const previousBackground = body.background;
    const previousBehaviour = root.scrollBehavior;

    body.background = "#0a0806";
    root.scrollBehavior = "auto";

    return () => {
      body.background = previousBackground;
      root.scrollBehavior = previousBehaviour;
    };
  }, []);

  return (
    <div className="atelier">
      <MarbleBackdrop />
      <Header />
      <main>
        <Hero />
        <StatsStrip />
        <Manifesto />
        <PlatformStage />
        <Closing />
      </main>
    </div>
  );
}
