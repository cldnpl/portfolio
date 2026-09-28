import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import NextLink from "next/link";
import { Fragment, useRef, useState } from "react";
import { MotionBox } from "@/components/MotionBox";
import { RevealLine } from "@/components/RevealLine";
import type { Project } from "@/data/projects";
import { CustomEase, gsap, SplitText, useGSAP } from "@/lib/gsap";
import { renderEmphasis } from "@/lib/emphasis";
import { useCursorStore } from "@/store/cursor";
import { rem } from "@/theme/rem";
import { legible } from "@/theme/legible";

const projectReveal = CustomEase.create("projectReveal", "0.22, 1, 0.36, 1");

type ProjectItemProps = {
  project: Project;
  index: number;
  onHoverChange: (hovered: boolean) => void;
};

/**
 * On desktop only the cover shows until it is hovered; then the meta row,
 * the title (word by word) and the description (line by line) rise in.
 */
export const ProjectItem = ({ project, index, onHoverChange }: ProjectItemProps) => {
  const { title, description, platforms, year, coverImage } = project;
  const [hovered, setHovered] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const number = String(index + 1).padStart(2, "0");
  const words = title.split(" ");
  const titleDuration = 0.18 + (words.length - 1) * 0.12;

  useGSAP(
    () => {
      const el = descriptionRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 48em)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            setLineCount(self.lines.length);
            const tl = gsap.timeline({ paused: true });
            tl.from(self.lines, { yPercent: 100, duration: 1.5, ease: projectReveal, stagger: 0.08 }, titleDuration + 0.18);
            timeline.current = tl;
            return tl;
          },
        });
        return () => {
          split.revert();
          timeline.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: descriptionRef },
  );

  useGSAP(
    () => {
      const tl = timeline.current;
      if (!tl) return;
      if (hovered) tl.play();
      else tl.reverse();
    },
    { dependencies: [hovered] },
  );

  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const setCursor = useCursorStore((s) => s.setCursor);
  const resetCursor = useCursorStore((s) => s.resetCursor);
  const href = project.href ? `/${project.href}` : "#";

  return (
    <Box
      minH={{ base: "auto", md: "80vh" }}
      display="flex"
      alignItems="center"
      py={{ base: "space-64", md: "space-80" }}
      cursor="default"
    >
      <Container>
        <Box
          borderBottom="1px solid"
          borderColor={{ base: "blackAlpha.200", md: hovered ? "blackAlpha.200" : "transparent" }}
          transition={{ base: "none", md: "border-color 0.4s ease" }}
          mb={{ base: "space-32", md: "space-48" }}
          pb="space-16"
        >
          <RevealLine isRevealed={hovered} delay={0}>
            <Flex justifyContent="space-between" alignItems="center">
              <Text variant="label" letterSpacing="0.2em">
                ({number})
              </Text>
              <Flex gap="space-16">
                {platforms && (
                  <Text variant="label" letterSpacing="0.2em">
                    {platforms.join(" & ")}
                  </Text>
                )}
                {year && (
                  <Text variant="label" letterSpacing="0.2em" color="blackAlpha.700">
                    {year}
                  </Text>
                )}
              </Flex>
            </Flex>
          </RevealLine>
        </Box>

        <Box mb={{ base: "space-40", md: "space-64" }}>
          <Text
            as="h3"
            fontFamily="body"
            fontWeight="bold"
            textTransform="uppercase"
            fontSize={`clamp(${rem(48)}, 10vw, ${rem(140)})`}
            lineHeight="compact"
            letterSpacing="-0.02em"
          >
            {words.length > 1 ? (
              words.map((word, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <RevealLine isRevealed={hovered} delay={0.18 + 0.12 * i}>
                    <Box as="span" display="block">
                      {word}
                    </Box>
                  </RevealLine>
                </Fragment>
              ))
            ) : (
              <RevealLine isRevealed={hovered} delay={0.18}>
                <Box as="span" display="block">
                  {title}
                </Box>
              </RevealLine>
            )}
          </Text>
        </Box>

        <Flex
          flexDir={{ base: "column", md: index % 2 === 0 ? "row" : "row-reverse" }}
          gap={{ base: "space-32", md: "space-48" }}
          alignItems={{ md: "flex-start" }}
        >
          <MotionBox
            ref={imageRef}
            style={{ y }}
            flexShrink={0}
            w={{ base: "100%", md: "55%" }}
            onMouseEnter={() => {
              setHovered(true);
              onHoverChange(true);
              setCursor("project", "View Project");
            }}
            onMouseLeave={() => {
              setHovered(false);
              onHoverChange(false);
              resetCursor();
            }}
            cursor="pointer"
          >
            <Link as={NextLink} href={href} scroll={false} display="block" _hover={{ textDecoration: "none" }}>
              <Box position="relative" w="100%" aspectRatio="16/9" overflow="hidden">
                {coverImage && (
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    style={{ objectFit: "cover" }}
                    priority={index < 2}
                  />
                )}
              </Box>
            </Link>
          </MotionBox>

          <Flex flexDir="column" justifyContent="space-between" flex="1" minH={{ md: "200px" }}>
            <Box mb={{ base: "space-32", md: "space-48" }} maxW={{ md: "90%" }}>
              <Text
                ref={descriptionRef}
                fontSize={`clamp(${rem(16)}, 2vw, ${rem(22)})`}
                lineHeight="base"
                fontWeight="normal"
                color="blackAlpha.800"
                sx={legible}
              >
                {renderEmphasis(description)}
              </Text>
            </Box>
            <RevealLine isRevealed={hovered} delay={titleDuration + 0.18 + 0.08 * lineCount + 0.1}>
              <Link
                as={NextLink}
                href={href}
                scroll={false}
                display={{ base: "inline-flex", md: "none" }}
                alignItems="center"
                gap="space-8"
                fontSize="sm"
                fontWeight="medium"
                textTransform="uppercase"
                letterSpacing="0.15em"
                _hover={{ textDecoration: "none", opacity: 0.6 }}
                transition="opacity 0.3s ease"
              >
                View Project
                <Box as="span" display="inline-block" ml="space-4">
                  →
                </Box>
              </Link>
            </RevealLine>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
