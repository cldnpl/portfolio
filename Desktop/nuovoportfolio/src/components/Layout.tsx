import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MarbleBackground } from "@/components/MarbleBackground";
import { MARBLE_MODE, useSite } from "@/data/site";

export const Layout = ({ children }: { children: ReactNode }) => {
  const { header, footer } = useSite();
  return (
    <Flex flexDir="column">
      {MARBLE_MODE === "full" && <MarbleBackground />}
      <Header data={header} />
      <Box as="main" display="block" mt={{ base: "112px", md: "160px" }}>
        {children}
      </Box>
      <Footer data={footer} />
    </Flex>
  );
};
