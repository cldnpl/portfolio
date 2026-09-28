import type { GetStaticProps } from "next";
import { useRef } from "react";
import { About } from "@/components/About";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Hero } from "@/components/Hero";
import { HeroMarble } from "@/components/MarbleBackground";
import { PageTransition } from "@/components/PageTransition";
import { PlatformStrip } from "@/components/PlatformStrip";
import { Services } from "@/components/Services";
import { aboutData, featuredData, heroData, homeSeo, MARBLE_MODE, platformsData, servicesData } from "@/data/site";

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  return (
    <PageTransition>
      <Hero data={heroData} />
      <PlatformStrip caption={platformsData.caption} platforms={platformsData.platforms} />
      <About id="about" data={aboutData} sectionRef={aboutRef} />
      <FeaturedWork id="projects" data={featuredData} />
      <Services data={servicesData} />
      {/* after About, so its ref is attached when the scroll tracking starts */}
      {MARBLE_MODE === "hero" && <HeroMarble fadeOn={aboutRef} />}
    </PageTransition>
  );
}

export const getStaticProps: GetStaticProps = async () => ({ props: { seo: homeSeo } });
