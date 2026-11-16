import { Box, Container, Heading, Link, Text } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { useUi } from "@/data/ui";
import { rem } from "@/theme/rem";

export default function NotFound() {
  const t = useUi().notFound;
  return (
    <PageTransition>
      <Head>
        <title>{`${t.title} | Claudia Napolitano`}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Box minH="70vh" display="flex" alignItems="flex-end">
        <Container pb={{ base: "space-64", md: "space-120" }}>
          <Heading as="h1" fontSize={`clamp(${rem(72)}, 18vw, ${rem(280)})`} lineHeight="compact">
            404
          </Heading>
          <Text variant="label" letterSpacing="0.2em" mt="space-24">
            {t.title}
          </Text>
          <Text mt="space-16" fontSize={`clamp(${rem(16)}, 1.4vw, ${rem(20)})`}>
            {t.text}
          </Text>
          <Link as={NextLink} href="/" display="inline-block" mt="space-32" fontSize="sm" textTransform="uppercase" letterSpacing="0.15em">
            {t.back} →
          </Link>
        </Container>
      </Box>
    </PageTransition>
  );
}
