import { Box, Container } from "@chakra-ui/react";
import { Availability } from "@/components/Availability";
import { Marquee } from "@/components/Marquee";
import { Meta } from "@/components/Meta";
import { Portrait } from "@/components/Portrait";
import { Section } from "@/components/Section";
import type { heroData } from "@/data/site";
import { useUi } from "@/data/ui";

export const Hero = ({ data }: { data: typeof heroData }) => {
  const { marquee, availability, location, timeZone, portrait } = data;
  const ui = useUi();
  return (
    <Section
      height={{ base: "calc(100vh - 112px)", md: "calc(100vh - 160px)" }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      spacingBottom="medium"
      isFullScreen
    >
      <Box flex="1" display="flex" flexDirection="column" justifyContent="center">
        {marquee.map((line, i) => (
          <Box
            key={i}
            data-intro="marquee-line"
            flex="1"
            display="flex"
            alignItems="center"
            position="relative"
            {...("styles" in line ? line.styles : {})}
          >
            <Marquee text={line.text} baseVelocity={line.baseVelocity} totalMarquees={marquee.length} />
          </Box>
        ))}
      </Box>
      <Portrait src={portrait} alt={ui.portraitAlt} />
      <Container display="flex" justifyContent="space-between" paddingBottom="space-16">
        <Meta location={location} timeZone={timeZone} />
        <Availability status={availability} />
      </Container>
    </Section>
  );
};
