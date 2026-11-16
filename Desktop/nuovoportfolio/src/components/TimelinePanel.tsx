import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { Service } from "@/data/site";

const MONO = `"SF Mono", ui-monospace, Menlo, Consolas, monospace`;
const SECONDS = [0, 1, 2, 3, 4, 5, 6, 7];

type TimelinePanelProps = { services: Service[]; showTiles: boolean };

/**
 * The dark editor panel the service tiles fly into (after butter.video's
 * timeline): transport bar, a ruler in seconds, one slot per service.
 * The slots are empty frames; the tiles themselves travel from the titles.
 */
export const TimelinePanel = forwardRef<HTMLDivElement, TimelinePanelProps>(({ services, showTiles }, ref) => (
  <Box
    ref={ref}
    position="relative"
    zIndex={1}
    mx="auto"
    width="100%"
    maxW="880px"
    bg="#151515"
    color="white"
    borderRadius={{ base: "18px", md: "28px" }}
    p={{ base: "space-16", md: "space-24" }}
    boxShadow="0 50px 90px -40px rgba(0, 0, 0, 0.55)"
    fontFamily={MONO}
  >
    <Flex alignItems="center" gap="space-12" fontSize={{ base: "10px", md: "xs" }} color="whiteAlpha.700">
      <Flex
        alignItems="center"
        justifyContent="center"
        gap="3px"
        w={{ base: "22px", md: "28px" }}
        h={{ base: "22px", md: "28px" }}
        borderRadius="8px"
        bg="whiteAlpha.100"
        aria-hidden
      >
        <Box w="3px" h="10px" borderRadius="1px" bg="whiteAlpha.800" />
        <Box w="3px" h="10px" borderRadius="1px" bg="whiteAlpha.800" />
      </Flex>
      <Text as="span">00:01.25 / 00:12</Text>
      <Box w="1px" h="12px" bg="whiteAlpha.300" />
      <Text as="span" color="whiteAlpha.500">
        Dur
      </Text>
      <Text as="span" px="6px" py="1px" borderRadius="4px" bg="whiteAlpha.200" color="white">
        5s
      </Text>
      <Text as="span" color="whiteAlpha.500">
        sec
      </Text>
    </Flex>

    <Box position="relative" mt={{ base: "space-12", md: "space-16" }} h="18px" aria-hidden>
      <Box position="absolute" top="4px" left="12%" w="30%" h="10px" borderRadius="3px" bg="whiteAlpha.200" />
      <Flex position="relative" justifyContent="space-between" alignItems="center" h="100%">
        {SECONDS.map((s) => (
          <Flex key={s} flex={s === SECONDS.length - 1 ? "0 0 auto" : "1"} alignItems="center" gap="0">
            <Text as="span" fontSize="9px" color="whiteAlpha.500" minW="14px">
              {s}s
            </Text>
            {s < SECONDS.length - 1 && (
              <Flex flex="1" justifyContent="space-evenly" alignItems="center" px="2px">
                {[0, 1, 2, 3].map((t) => (
                  <Box key={t} w="1px" h="5px" bg="whiteAlpha.300" />
                ))}
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>
    </Box>

    <SimpleGrid columns={services.length} spacing={{ base: "space-8", md: "space-16" }} mt={{ base: "space-12", md: "space-20" }}>
      {services.map((service, i) => (
        <Box key={service.title}>
          <Box
            data-service-slot={i}
            position="relative"
            aspectRatio="1"
            borderRadius="22%"
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
            overflow="hidden"
          >
            {showTiles && (
              <img
                src={service.image}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </Box>
          <Text mt="space-8" textAlign="center" fontSize={{ base: "9px", md: "xs" }} color="whiteAlpha.600">
            {service.label}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  </Box>
));

TimelinePanel.displayName = "TimelinePanel";
