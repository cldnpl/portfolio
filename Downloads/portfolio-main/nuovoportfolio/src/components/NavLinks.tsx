import { chakra, Flex, Link, Text } from "@chakra-ui/react";
import { useLenis } from "lenis/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { Magnetic } from "@/components/Magnetic";
import type { NavLinkItem } from "@/data/site";

const index = (i: number) => String(i + 1).padStart(2, "0");

type NavLinksProps = { links: NavLinkItem[]; onNavigate?: () => void };

export const NavLinks = ({ links, onNavigate }: NavLinksProps) => {
  const lenis = useLenis();
  const router = useRouter();

  const handleAnchor = (event: MouseEvent, href: string) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    const target = typeof document !== "undefined" ? document.getElementById(href.slice(1)) : null;
    if (target) {
      onNavigate?.();
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    onNavigate?.();
    router.push(`/${href}`);
  };

  return (
    <Flex as="nav" direction={{ base: "column", md: "row" }} gap={{ base: 0, md: "space-16" }}>
      {links.map((link, i) => {
        const isAnchor = link.href.startsWith("#");
        const number = (
          <Text as="span" display={{ base: "block", md: "none" }} marginRight="space-16" fontSize="sm">
            {index(i)}
          </Text>
        );
        return (
          <Magnetic key={i}>
            {isAnchor ? (
              <NavLink data-intro="nav-item" href={link.href} onClick={(e) => handleAnchor(e, link.href)}>
                {number}
                {link.title}
              </NavLink>
            ) : (
              <NavLink as={NextLink} data-intro="nav-item" href={link.href} scroll={false}>
                {number}
                {link.title}
              </NavLink>
            )}
          </Magnetic>
        );
      })}
    </Flex>
  );
};

// `" md"` (with the space) is how the reference ships it: an unknown token,
// so on desktop the links simply inherit the body size.
const NavLink = chakra(Link, {
  baseStyle: {
    display: "flex",
    fontSize: { base: "4xl", md: " md" },
    fontWeight: "normal",
    // the titles are written capitalised already; "capitalize" would turn "Chi sono" into "Chi Sono"
    marginBottom: { base: "space-16", md: 0 },
  },
});
