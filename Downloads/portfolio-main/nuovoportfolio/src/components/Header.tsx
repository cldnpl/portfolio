import { Box, Button, chakra, Container, Flex, Heading, Link, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLinks } from "@/components/NavLinks";
import type { NavLinkItem } from "@/data/site";

type HeaderProps = { data: { title: string; links: NavLinkItem[]; socials: NavLinkItem[] } };

export const Header = ({ data }: HeaderProps) => {
  const { title, links, socials } = data;
  const words = title.split(" ");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box as="header" position="fixed" top="0" width="100%" zIndex="header">
        <Container py={{ base: "space-20", md: "space-32" }}>
          <Flex justifyContent="space-between" alignItems="center">
            <Link as={NextLink} href="/" scroll={false} _after={{ display: "none" }}>
              <Flex direction="column" width="fit-content">
                {words.map((word, i) => (
                  <Heading
                    key={i}
                    as="span"
                    textTransform="uppercase"
                    fontSize={{ base: "5xl", md: "6xl" }}
                    lineHeight="none"
                    marginLeft={i !== 0 ? "space-36" : 0}
                  >
                    {word}
                  </Heading>
                ))}
              </Flex>
            </Link>
            <MenuButton onClick={onOpen}>menu</MenuButton>
            <Box display={{ base: "none", md: "block" }}>
              <NavLinks links={links} />
            </Box>
          </Flex>
        </Container>
      </Box>
      <MobileMenu isOpen={isOpen} onClose={onClose} links={links} socials={socials} />
    </>
  );
};

const MenuButton = chakra(Button, {
  baseStyle: {
    textTransform: "uppercase",
    display: { base: "block", md: "none" },
    background: "none",
    fontWeight: "normal",
    border: "1px solid",
    borderColor: "black",
    borderRadius: "unset",
    fontSize: "sm",
  },
});
