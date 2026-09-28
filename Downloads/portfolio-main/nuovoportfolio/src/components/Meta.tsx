import { Flex, Text } from "@chakra-ui/react";
import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useState } from "react";
import { useScramble } from "@/hooks/useScramble";
import { useIntroStore } from "@/store/intro";

type MetaProps = { location: string; timeZone: string };

/** "based in naples • 09:41:07", live clock in the local time zone. */
export const Meta = ({ location, timeZone }: MetaProps) => {
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);
  const label = useScramble(location, useIntroStore((s) => s.revealMeta));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const time = mounted ? formatInTimeZone(now, timeZone, "HH:mm:ss") : "";

  return (
    <Flex data-intro="meta-item" whiteSpace="break-spaces">
      <Text variant="label"> {label} </Text>
      <Text variant="label" _before={{ content: '" • "' }}>
        {time}
      </Text>
    </Flex>
  );
};
