import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { ContactForm } from "@/components/ContactForm";
import { MARBLE_ID } from "@/components/MarbleBackground";
import { MARBLE_OPACITY } from "@/data/site";
import type { footerData } from "@/data/site";
import { rem } from "@/theme/rem";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Contact footer; while it scrolls in, the whole page fades from white to near-black. */
export const Footer = ({ data }: { data: typeof footerData }) => {
  const { heading, cta, email, copyright, credit, socials } = data;
  const ref = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const background = useTransform(scrollYProgress, [0, 0.5], ["#ffffff", "#0e0e0e"]);
  const marble = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const offBackground = background.on("change", (value) => {
      document.body.style.backgroundColor = value;
    });
    // the marble fades out on the same curve, so the page still ends near-black
    // straight on the element: a CSS variable on <html> would restyle the whole page every frame
    const offMarble = marble.on("change", (value) => {
      const slab = document.getElementById(MARBLE_ID);
      if (slab) slab.style.opacity = String(value * MARBLE_OPACITY);
    });
    return () => {
      offBackground();
      offMarble();
      document.body.style.backgroundColor = "#ffffff";
      const slab = document.getElementById(MARBLE_ID);
      if (slab) slab.style.opacity = String(MARBLE_OPACITY);
    };
  }, [background, marble]);

  return (
    <Box
      as="footer"
      id="contact"
      ref={ref}
      color="white"
      minH="100vh"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      overflow="hidden"
      marginTop={{ base: "space-188", md: "space-232" }}
    >
      <Container flex="1" display="flex" flexDir="column" justifyContent="center" py={{ base: "space-80", md: "space-120" }}>
        <Box opacity={inView ? 1 : 0} transform={`translateY(${inView ? 0 : 20}px)`} transition={`all 0.6s ${EASE}`}>
          <Text textTransform="uppercase" fontSize="xs" letterSpacing="0.2em" mb="space-20" color="whiteAlpha.600">
            {cta}
          </Text>
        </Box>
        <Box overflow="hidden" mb={{ base: "space-24", md: "space-32" }}>
          <Text
            as="h2"
            fontFamily="heading"
            fontWeight="bold"
            textTransform="uppercase"
            fontSize={`clamp(${rem(72)}, 18vw, ${rem(280)})`}
            lineHeight="compact"
            transform={`translateY(${inView ? "0%" : "100%"})`}
            transition={`transform 0.9s ${EASE} 0.1s`}
          >
            {heading}
          </Text>
        </Box>
        <Box
          h="1px"
          bg="whiteAlpha.300"
          mb={{ base: "space-24", md: "space-32" }}
          transform={`scaleX(${inView ? 1 : 0})`}
          transformOrigin="left"
          transition={`transform 1s ${EASE} 0.3s`}
        />
        <ContactForm email={email} isInView={inView} />
      </Container>
      <Container pb="space-24">
        <Flex
          borderTop="1px solid"
          borderColor="whiteAlpha.200"
          pt="space-24"
          flexDir={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "flex-start", md: "center" }}
          gap={{ base: "space-20", md: "0" }}
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.1em"
        >
          <Text color="whiteAlpha.500">
            ©{year} {copyright}
          </Text>
          <Flex as="nav" gap="space-24">
            {socials.map((social, i) => (
              <Link
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                color="whiteAlpha.700"
                _hover={{ color: "white", textDecoration: "none" }}
                _after={{ bg: "white" }}
                transition="color 0.3s ease"
              >
                {social.title}
              </Link>
            ))}
          </Flex>
          <Text color="whiteAlpha.500" display={{ base: "none", md: "block" }}>
            {credit}
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};
