import type { GetStaticProps } from "next";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { About } from "@/components/About";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Hero } from "@/components/Hero";
import { HeroMarble } from "@/components/MarbleBackground";
import { PageTransition } from "@/components/PageTransition";
import { PlatformStrip } from "@/components/PlatformStrip";
import { Services } from "@/components/Services";
import { MARBLE_MODE, siteContent, useSite } from "@/data/site";
import { scrollToAnchor } from "@/lib/anchor";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { hero, platforms, about, featured, services } = useSite();
  const lenis = useLenis();

  // Arriving from a project page through a menu link (/#about, /#projects,
  // /#contact): go to that section once the page has laid out.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target || !lenis) return;
    const t = setTimeout(() => scrollToAnchor(target, lenis), 400);
    return () => clearTimeout(t);
  }, [lenis]);
  return (
    <PageTransition>
      <Hero data={hero} />
      <PlatformStrip caption={platforms.caption} platforms={platforms.platforms} />
      <About id="about-intro" data={about} sectionRef={aboutRef} />
      <FeaturedWork id="projects" data={featured} />
      <Services data={services} />
      {/* after About, so its ref is attached when the scroll tracking starts */}
      {MARBLE_MODE === "hero" && <HeroMarble fadeOn={aboutRef} />}
    </PageTransition>
  );
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { seo: { en: siteContent.en.seo, it: siteContent.it.seo } },
});
