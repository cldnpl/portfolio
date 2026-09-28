import type { GetStaticProps } from "next";
import { useRef } from "react";
import { About } from "@/components/About";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Hero } from "@/components/Hero";
import { HeroMarble } from "@/components/MarbleBackground";
import { PageTransition } from "@/components/PageTransition";
import { PlatformStrip } from "@/components/PlatformStrip";
import { Services } from "@/components/Services";
import { MARBLE_MODE, siteContent, useSite } from "@/data/site";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { hero, platforms, about, featured, services } = useSite();
  return (
    <PageTransition>
      <Hero data={hero} />
      <PlatformStrip caption={platforms.caption} platforms={platforms.platforms} />
      <About id="about" data={about} sectionRef={aboutRef} />
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
