import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { hasIntroPlayed, useIntroStore } from "@/store/intro";

gsap.registerPlugin(useGSAP);

const LOADING = "intro-loading";
const NAV_ONLY = "intro-nav-only";
const SKIP_LOADER = "intro-skip-loader";

const MARQUEE = '[data-intro="marquee-line"]';
const PORTRAIT = '[data-intro="portrait"]';
const META = '[data-intro="meta-item"]';
const NAV = '[data-intro="nav-item"]';

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

const navIn = { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" };

/**
 * Home intro, after the loader: the marquee lines wipe up one by one, the
 * portrait follows, then the meta labels decode and the nav fades in. On a
 * repeat visit in the same session only the nav animates.
 */
export const IntroAnimation = () => {
  const loaderComplete = useIntroStore((s) => s.loaderComplete);
  const setLoaderComplete = useIntroStore((s) => s.setLoaderComplete);
  const setRevealMeta = useIntroStore((s) => s.setRevealMeta);
  const [played] = useState(() => hasIntroPlayed());

  useGSAP(() => {
    const html = document.documentElement;
    if (played) html.classList.add(NAV_ONLY, SKIP_LOADER);
    else html.classList.add(LOADING);
    setRevealMeta(false);
    return () => html.classList.remove(LOADING, NAV_ONLY, SKIP_LOADER);
  }, []);

  useEffect(() => {
    if (played) setLoaderComplete();
  }, [played, setLoaderComplete]);

  useGSAP(
    () => {
      if (!loaderComplete) return;
      const finish = () => document.documentElement.classList.remove(LOADING, NAV_ONLY);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (!played) {
          gsap.set([MARQUEE, PORTRAIT], { clipPath: SHOWN, y: 0, scale: 1 });
          gsap.set(META, { opacity: 1, y: 0 });
        }
        gsap.set(NAV, { opacity: 1, y: 0 });
        finish();
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (played) {
          gsap.fromTo(NAV, { opacity: 0, y: 12 }, { ...navIn, onComplete: finish });
          return;
        }
        gsap
          .timeline({ defaults: { ease: "power4.out" }, onComplete: finish })
          .fromTo(MARQUEE, { clipPath: HIDDEN, y: 40 }, { clipPath: SHOWN, y: 0, duration: 0.9, stagger: 0.12 })
          .fromTo(PORTRAIT, { clipPath: HIDDEN, scale: 1.06 }, { clipPath: SHOWN, scale: 1, duration: 1 }, "-=0.4")
          .add(() => setRevealMeta(true), "-=0.2")
          .fromTo(META, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "<")
          .fromTo(NAV, { opacity: 0, y: 12 }, navIn, "-=0.1");
      });
    },
    { dependencies: [loaderComplete] },
  );

  return null;
};
