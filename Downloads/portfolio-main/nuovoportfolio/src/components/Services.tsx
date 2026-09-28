import { Box, Container, Text } from "@chakra-ui/react";
import { useInView, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { ScrollQuote } from "@/components/ScrollQuote";
import { Section } from "@/components/Section";
import { ServiceRow } from "@/components/ServiceRow";
import { SplitParagraph } from "@/components/SplitParagraph";
import type { servicesData } from "@/data/site";

type Service = (typeof servicesData)["services"][number];

const ServicesList = ({ intro, services }: { intro: string; services: Service[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduceMotion = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);

  return (
    <Container ref={ref} mt={{ base: "space-120", md: "space-200" }}>
      <Text variant="label" letterSpacing="0.2em" mb={{ base: "space-32", md: "space-64" }}>
        (Services)
      </Text>
      <Box overflow="hidden" display="flex" flexDirection="column" gap={{ base: "space-8", md: "space-12" }}>
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
              isActive={active === i}
              onToggle={() => setActive((current) => (current === i ? null : i))}
            />
          );
        })}
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={{ base: "space-40", md: "space-64" }}>
        <Box position="relative" width={{ base: "100%", md: "480px" }}>
          <SplitParagraph
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
  const { content, servicesIntro, services } = data;
  return (
    <Section isFullScreen spacingBottom="extraLarge">
      <Container>
        <ScrollQuote text={content} />
      </Container>
      <ServicesList intro={servicesIntro} services={services} />
    </Section>
  );
};
