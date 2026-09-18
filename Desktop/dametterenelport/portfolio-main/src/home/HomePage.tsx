import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/atelier.css";
import Contact from "./components/Contact";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import MarbleBackdrop from "./components/MarbleBackdrop";
import PlatformStage from "./components/PlatformStage";
import StatsStrip from "./components/StatsStrip";

export default function HomePage() {
  const { hash } = useLocation();

  // Landing on /#contact — from the nav on another page, from the button on
  // the phone in the 3D section, or from a link somebody shared — has to
  // arrive at the form. React Router does not scroll for a hash on its own,
  // and until now that link simply dropped the reader at the top.
  //
  // Deferred by a task, deliberately. Scrolling straight from the effect is
  // undone: the router's history entry is processed at the end of the same
  // task and the view snaps back to the top. requestAnimationFrame is the
  // usual reflex here, but a tab opened in the background never gets a frame,
  // so the jump would silently wait until somebody looked at it. Instant
  // rather than smooth, too: the form is six screens down.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const timer = window.setTimeout(() => target.scrollIntoView({ block: "start" }), 0);
    return () => window.clearTimeout(timer);
  }, [hash]);

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
        <Contact />
      </main>
    </div>
  );
}
