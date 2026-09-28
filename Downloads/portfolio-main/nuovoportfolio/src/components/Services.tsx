import { Box, Container, Text } from "@chakra-ui/react";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HoloText } from "@/components/HoloText";
import { Photo, PhotoData } from "@/components/Photo";
import { ScrollQuote } from "@/components/ScrollQuote";
import { Section } from "@/components/Section";
import { ServiceRow } from "@/components/ServiceRow";
import { TimelinePanel } from "@/components/TimelinePanel";
import type { Service, servicesData } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Layout position in the page, ignoring transforms (entrance slides, the flight itself). */
const layoutBox = (el: HTMLElement) => {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

const ServicesList = ({ intro, photo, services }: { intro: string; photo: PhotoData; services: Service[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);

  // Opening a service's details pushes the panel down: re-measure the flights
  // once the drawer has finished moving.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [active]);

  // As the panel scrolls up into view, each tile leaves its title and lands
  // in its slot, growing to fill it, with a little tumble on the way.
  useGSAP(
    () => {
      const root = ref.current;
      const panel = panelRef.current;
      if (!root || !panel || reduceMotion) return;
      const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-service-tile]"));
      const slots = Array.from(root.querySelectorAll<HTMLElement>("[data-service-slot]"));

      const delta = (i: number) => {
        const from = layoutBox(tiles[i]);
        const to = layoutBox(slots[i]);
        return {
          x: to.x + to.w / 2 - (from.x + from.w / 2),
          y: to.y + to.h / 2 - (from.y + from.h / 2),
          scale: to.w / from.w,
        };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top bottom",
          end: "top 30%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tiles.forEach((tile, i) => {
        const at = i * 0.16;
        tl.to(tile, { x: () => delta(i).x, duration: 1, ease: "power2.inOut" }, at)
          .to(tile, { y: () => delta(i).y, duration: 1, ease: "power3.in" }, at)
          .to(tile, { scale: () => delta(i).scale, duration: 1, ease: "power2.inOut" }, at)
          .to(tile, { rotation: i % 2 ? 10 : -10, duration: 0.5, ease: "sine.out" }, at)
          .to(tile, { rotation: 0, duration: 0.5, ease: "sine.in" }, at + 0.5);
      });
      return () => gsap.set(tiles, { clearProps: "transform" });
    },
    { scope: ref, dependencies: [reduceMotion] },
  );

  return (
    <Container ref={ref} mt={{ base: "space-120", md: "space-200" }}>
      <Text variant="label" letterSpacing="0.2em" mb={{ base: "space-32", md: "space-64" }}>
        (Services)
      </Text>
      {/* above the panel, so the tiles fly over it; clipped sideways only, so they can leave vertically */}
      <Box
        position="relative"
        zIndex={2}
        overflowX="clip"
        overflowY="visible"
        display="flex"
        flexDirection="column"
        gap={{ base: "space-8", md: "space-12" }}
      >
        {services.map((service, i) => {
          const align = i % 2 === 0 ? "left" : "right";
          return (
            <ServiceRow
              key={service.title}
              title={service.title}
              items={service.items}
              index={i}
              align={align}
              indent={align === "left" && i > 0}
              isInView={isInView}
              reduceMotion={reduceMotion}
              image={service.image}
              video={service.video}
              isActive={active === i}
              onToggle={() => setActive((current) => (current === i ? null : i))}
            />
          );
        })}
      </Box>
      <Box mt={{ base: "space-64", md: "space-120" }}>
        <TimelinePanel ref={panelRef} services={services} showTiles={reduceMotion} />
      </Box>
      {/* the hackathon it mentions, next to the text */}
      <Box
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        justifyContent={{ md: "flex-end" }}
        alignItems={{ md: "center" }}
        gap={{ base: "space-40", md: "space-48" }}
        mt={{ base: "space-40", md: "space-64" }}
      >
        <Photo photo={photo} sizes="(max-width: 832px) 70vw, 320px" width={{ base: "70%", md: "320px" }} flexShrink={0} />
        <Box position="relative" width={{ base: "100%", md: "480px" }}>
          <HoloText
            variant="paragraph"
            text={intro}
            fontFamily="body"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="short"
            color="blackAlpha.800"
          />
        </Box>
      </Box>
    </Container>
  );
};

export const Services = ({ data }: { data: typeof servicesData }) => {
  const { content, servicesIntro, photo, services } = data;
  return (
    <Section isFullScreen spacingBottom="extraLarge">
      <Container>
        <ScrollQuote text={content} />
      </Container>
      <ServicesList intro={servicesIntro} photo={photo} services={services} />
    </Section>
  );
};
