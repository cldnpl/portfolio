import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import NextLink from "next/link";
import { useMemo, useRef } from "react";
import { Letters, lettersDelay } from "@/components/Letters";
import { MotionBox } from "@/components/MotionBox";
import { localizedProjects } from "@/data/projects";
import { useUi } from "@/data/ui";
import { useLanguage } from "@/lib/language";
import { useCursorStore } from "@/store/cursor";
import { rem } from "@/theme/rem";
import { legible } from "@/theme/legible";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export const NextProject = ({ currentHref }: { currentHref: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const ui = useUi();
  const { lang } = useLanguage();
  const setCursor = useCursorStore((s) => s.setCursor);
  const resetCursor = useCursorStore((s) => s.resetCursor);

  const next = useMemo(() => {
    const linked = localizedProjects(lang).filter((p) => p.href);
    if (!linked.length) return null;
    const current = linked.findIndex((p) => p.href === currentHref);
    return linked[((current < 0 ? 0 : current) + 1) % linked.length];
  }, [currentHref, lang]);

  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  if (!next) return null;
  const { title, coverImage, portraitImage, year, platforms } = next;
  const lettersDone = lettersDelay(title.length, 0.1, 0.03);

  return (
    <Box as="section" ref={ref} py={{ base: "space-120", md: "space-188" }} overflow="hidden">
      <Container>
        <Link
          as={NextLink}
          href={`/${next.href}`}
          scroll={false}
          display="block"
          _hover={{ textDecoration: "none" }}
          onMouseEnter={() => setCursor("project", ui.nextProject)}
          onMouseLeave={() => resetCursor()}
          sx={{
            "&:hover .np-image": { transform: "scale(1.04)" },
            "&:hover .np-underline": { transform: "scaleX(1)" },
            "&:hover .np-arrow": { transform: "translateX(12px)" },
          }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={{ base: "space-24", md: "space-40" }}>
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.2em"
              opacity={isInView ? 1 : 0}
              transform={`translateY(${isInView ? 0 : 12}px)`}
              transition={`all 0.7s ${EASE}`}
            >
              ({ui.nextProject})
            </Text>
            {year && (
              <Text
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.2em"
                color="blackAlpha.700"
                opacity={isInView ? 1 : 0}
                transform={`translateY(${isInView ? 0 : 12}px)`}
                transition={`all 0.7s ${EASE} 0.05s`}
              >
                {year}
              </Text>
            )}
          </Flex>
          <Box
            h="1px"
            bg="blackAlpha.200"
            mb={{ base: "space-40", md: "space-64" }}
            transform={`scaleX(${isInView ? 1 : 0})`}
            transformOrigin="left"
            transition={`transform 1s ${EASE} 0.1s`}
          />
          <Flex
            flexDir={{ base: "column", md: "row" }}
            gap={{ base: "space-40", md: "space-64" }}
            alignItems={{ md: "flex-end" }}
            justifyContent="space-between"
          >
            <Box flex="1" minW={0}>
              <Box
                as="h2"
                fontFamily="heading"
                fontWeight="bold"
                textTransform="uppercase"
                fontSize={`clamp(${rem(56)}, 12vw, ${rem(180)})`}
                lineHeight="compact"
                letterSpacing="-0.02em"
                aria-label={title}
              >
                <Letters text={title} isInView={isInView} delay={0.1} stagger={0.03} />
              </Box>
              <Box
                mt={{ base: "space-24", md: "space-40" }}
                h="1px"
                bg="black"
                transformOrigin="left"
                className="np-underline"
                style={{ transform: "scaleX(0)", transition: `transform 0.8s ${EASE}` }}
              />
              <Flex
                mt={{ base: "space-16", md: "space-24" }}
                justifyContent="space-between"
                alignItems="center"
                gap="space-24"
                opacity={isInView ? 1 : 0}
                transform={`translateY(${isInView ? 0 : 12}px)`}
                transition={`all 0.7s ${EASE} ${lettersDone + 0.15}s`}
              >
                {platforms && (
                  <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" color="blackAlpha.800" sx={legible}>
                    {platforms.join(" & ")}
                  </Text>
                )}
              </Flex>
            </Box>
            <MotionBox
              ref={imageRef}
              style={{ y }}
              flexShrink={0}
              w={{ base: "100%", md: "38%" }}
              alignSelf={{ md: "flex-start" }}
            >
              <Box
                position="relative"
                w="100%"
                aspectRatio={{ base: "16/9", md: "4/5" }}
                overflow="hidden"
                clipPath={isInView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)"}
                style={{ transition: `clip-path 1.2s ${EASE} 0.2s` }}
              >
                {(portraitImage || coverImage) && (
                  <Box
                    className="np-image"
                    position="absolute"
                    inset={0}
                    style={{ transform: "scale(1)", transition: `transform 1.2s ${EASE}`, willChange: "transform" }}
                  >
                    <Image
                      src={portraitImage || coverImage}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 38vw"
                      style={{ objectFit: portraitImage ? "contain" : "cover" }}
                    />
                  </Box>
                )}
              </Box>
            </MotionBox>
            <Flex
              display={{ base: "inline-flex", md: "none" }}
              alignItems="center"
              justifyContent="center"
              gap="space-8"
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.2em"
              mt="space-8"
            >
              <Text as="span">{ui.nextProject}</Text>
              <Box
                as="span"
                className="np-arrow"
                display="inline-block"
                style={{ transform: "translateX(0)", transition: `transform 0.6s ${EASE}` }}
              >
                →
              </Box>
            </Flex>
          </Flex>
        </Link>
      </Container>
    </Box>
  );
};
