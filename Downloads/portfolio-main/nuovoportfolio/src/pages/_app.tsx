import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Cursor } from "@/components/Cursor";
import { IntroAnimation } from "@/components/IntroAnimation";
import { Layout } from "@/components/Layout";
import { Loader } from "@/components/Loader";
import { Seo } from "@/components/Seo";
import "@/styles/globals.css";
import { theme } from "@/theme";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Seo {...pageProps.seo} />
      <ChakraProvider theme={theme} resetCSS>
        <Cursor />
        <ReactLenis root autoRaf>
          <Layout>
            <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
              <Component {...pageProps} key={router.asPath} />
            </AnimatePresence>
          </Layout>
        </ReactLenis>
        {router.pathname === "/" && (
          <>
            <IntroAnimation />
            <Loader />
          </>
        )}
      </ChakraProvider>
    </>
  );
}
