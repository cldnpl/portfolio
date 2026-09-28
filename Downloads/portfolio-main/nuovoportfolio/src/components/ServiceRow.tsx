import { Box, Text } from "@chakra-ui/react";
import { useUi } from "@/data/ui";
import { useScramble } from "@/hooks/useScramble";
import { legible } from "@/theme/legible";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type ServiceRowProps = {
  title: string;
  items: string[];
  index: number;
  align: "left" | "right";
  indent: boolean;
  isInView: boolean;
  reduceMotion: boolean;
  image?: string;
  video?: string;
  isActive: boolean;
  onToggle: () => void;
};

/** A giant title with a thumbnail in brackets; clicking it decodes the details. */
export const ServiceRow = ({
  title,
  items,
  index,
  align,
  indent,
  isInView,
  reduceMotion,
  image,
  video,
  isActive,
  onToggle,
}: ServiceRowProps) => {
  const ui = useUi();
  const left = align === "left";
  const delay = 0.12 * index;
  const details = useScramble(items.join("  ·  "), isActive && !reduceMotion, { speed: 25, tick: 0.8 });

  return (
    <Box
      display="flex"
      justifyContent={{ base: "flex-start", md: left ? "flex-start" : "flex-end" }}
      pl={{ md: left && indent ? "10%" : 0 }}
    >
      <Box
        role="group"
        display="inline-flex"
        flexDirection="column"
        alignItems={{ base: "flex-start", md: left ? "flex-start" : "flex-end" }}
        opacity={isInView ? 1 : 0}
        transform={`translateX(${isInView ? 0 : reduceMotion ? 0 : left ? -80 : 80}px)`}
        transition={`transform 0.8s ${EASE} ${delay}s, opacity 0.8s ease ${delay}s`}
        willChange="transform, opacity"
      >
        <Box
          as="button"
          type="button"
          onClick={onToggle}
          aria-expanded={isActive}
          position="relative"
          display="inline-flex"
          alignItems="center"
          appearance="none"
          border="none"
          bg="transparent"
          p={0}
          m={0}
          cursor="pointer"
          textAlign={left ? "left" : "right"}
          color="inherit"
          _focusVisible={{ outline: "2px solid", outlineOffset: "8px" }}
        >
          <Text
            as="span"
            fontFamily="body"
            fontWeight="bold"
            textTransform="uppercase"
            lineHeight="compact"
            letterSpacing="-0.025em"
            fontSize="clamp(2rem, 8vw, 6.5rem)"
          >
            {title}{" "}
            <Box as="span" whiteSpace="nowrap" fontWeight="normal">
              (
              {/* the outer span is what flies into the panel (GSAP, in Services);
                  the inner one keeps its own entrance transition */}
              <Box
                as="span"
                data-service-tile={index}
                display="inline-block"
                verticalAlign="middle"
                position="relative"
                zIndex={3}
                mx="0.06em"
                width="0.56em"
                height="0.56em"
                transformOrigin="50% 50%"
              >
                <Box
                  as="span"
                  display="block"
                  width="100%"
                  height="100%"
                  borderRadius="22%"
                  overflow="hidden"
                  boxShadow="0 0.06em 0.12em rgba(0, 0, 0, 0.18)"
                  transform={`scale(${isInView || reduceMotion ? 1 : 0.4})`}
                  opacity={isInView ? 1 : 0}
                  transition={`transform 0.6s ${EASE} ${delay + 0.1}s, opacity 0.6s ease ${delay + 0.1}s`}
                >
                  {video ? (
                    <video
                      src={video}
                      poster={image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    image && (
                      <img
                        src={image}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    )
                  )}
                </Box>
              </Box>
              )
            </Box>
          </Text>
          <Text
            as="span"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            {...(left ? { left: "100%", ml: "space-16" } : { right: "100%", mr: "space-16" })}
            display={{ base: "none", md: "block" }}
            fontFamily="body"
            fontWeight="normal"
            fontSize="sm"
            color="blackAlpha.700"
            sx={legible}
            whiteSpace="nowrap"
            opacity={isActive ? 1 : 0}
            transition="opacity 0.3s ease"
            _groupHover={{ opacity: 1 }}
          >
            {isActive ? ui.closeDetails : left ? ui.clickMeLeft : ui.clickMeRight}
          </Text>
        </Box>
        <Box
          overflow="hidden"
          width="100%"
          maxHeight={isActive ? "240px" : "0px"}
          opacity={isActive ? 1 : 0}
          transition={`max-height 0.6s ${EASE}, opacity 0.5s ease`}
        >
          <Text
            mt={{ base: "space-12", md: "space-16" }}
            fontFamily="body"
            fontWeight="normal"
            textTransform="uppercase"
            letterSpacing="0.08em"
            lineHeight="short"
            fontSize={{ base: "sm", md: "lg" }}
            color="blackAlpha.800"
            sx={legible}
            textAlign={left ? "left" : "right"}
          >
            {details}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
