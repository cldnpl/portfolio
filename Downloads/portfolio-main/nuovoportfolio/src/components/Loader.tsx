import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { useSite } from "@/data/site";
import { hasIntroPlayed, markIntroPlayed, useIntroStore } from "@/store/intro";
import { rem } from "@/theme/rem";

const pickWeighted = (items: { text: string; weight: number }[]) => {
  let roll = Math.floor(Math.random() * items.reduce((sum, item) => sum + item.weight, 0));
  for (const item of items) {
    if (roll < item.weight) return item.text;
    roll -= item.weight;
  }
  return items[items.length - 1].text;
};

/** Counts to 100 over a random fact, waits, then lifts off like a curtain. */
export const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [fact, setFact] = useState("");
  const setLoaderComplete = useIntroStore((s) => s.setLoaderComplete);
  const { loaderFacts } = useSite();

  useEffect(() => {
    if (hasIntroPlayed()) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setFact(pickWeighted(loaderFacts));
    const interval = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            document.body.style.overflow = overflow;
            setDone(true);
          }, 1500);
          return 100;
        }
        return value + 1;
      });
    }, 10);
    return () => {
      clearInterval(interval);
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <Section
      data-loader
      height="100dvh"
      width="100vw"
      bg="black"
      position="fixed"
      top="0"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      transform={done ? "translateY(-100vh)" : "translateY(0)"}
      transition="transform 1s cubic-bezier(0.76, 0, 0.24, 1)"
      onTransitionEnd={(event) => {
        if (done && event.propertyName === "transform") {
          markIntroPlayed();
          setLoaderComplete();
        }
      }}
      zIndex="loader"
    >
      <Flex direction="column">
        <Heading as="span" fontWeight="semibold" color="white" fontSize={`clamp(${rem(48)}, 5vw, ${rem(70)})`}>
          {fact}
        </Heading>
        <Heading as="span" color="white" fontSize="9xl">
          {progress}%
        </Heading>
      </Flex>
    </Section>
  );
};
