import { extendTheme } from "@chakra-ui/react";
import { rem } from "@/theme/rem";
import { fonts } from "@/theme/fonts";
import { legible } from "@/theme/legible";

const spacePx = [
  4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44, 48, 52, 56, 60, 64, 72,
  76, 80, 88, 94, 96, 100, 104, 112, 120, 128, 136, 144, 152, 156, 160, 168, 172, 176, 188, 192,
  200, 226, 232, 272, 288, 328, 384, 400,
];

const space = Object.fromEntries(spacePx.map((px) => [`space-${px}`, rem(px)]));

const Container = {
  baseStyle: {
    maxWidth: "100%",
    width: "container.3xl",
    paddingInline: "2.23vw",
  },
};

const Heading = {
  baseStyle: {
    lineHeight: "compact",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sizes: {
    h1: {
      display: "inline-block",
      w: "max-content",
      pr: { base: "space-24", md: "space-48" },
      lineHeight: "compact !important",
      whiteSpace: "nowrap",
      willChange: "transform",
    },
    h2: {
      fontSize: `clamp(${rem(64)}, 20vw, ${rem(304)})`,
      lineHeight: "compact",
      fontWeight: "bold",
    },
    h3: { fontSize: "clamp(32px, 18vw, 128px)", fontWeight: "bold" },
    h4: { fontSize: "clamp(24px, 18vw, 96px)", fontWeight: "bold" },
    h5: { fontSize: "clamp(20px, 18vw, 80px)", fontWeight: "bold" },
    h6: { fontSize: "clamp(16px, 18vw, 64px)", fontWeight: "bold" },
  },
  variants: {
    quote: {
      fontFamily: "Humane",
      fontWeight: "bold",
      fontSize: `clamp(${rem(64)}, 8vw, ${rem(115)})`,
      lineHeight: "compact",
    },
  },
};

const Text = {
  baseStyle: {},
  variants: {
    paragraph: {
      fontWeight: "normal",
      fontSize: `clamp(${rem(14)}, 7vw, ${rem(40)})`,
      lineHeight: "base",
      letterSpacing: "normal",
    },
    label: {
      fontWeight: "normal",
      textTransform: "uppercase",
      fontSize: "sm",
      ...legible,
    },
  },
};

const Link = {
  baseStyle: {
    position: "relative",
    _after: {
      content: "''",
      position: "absolute",
      left: 0,
      bottom: 0,
      w: "0%",
      h: "1px",
      bg: "black",
      transition: "width 0.3s",
    },
    _hover: { textDecoration: "none", _after: { w: "100%" } },
  },
};

export const theme = extendTheme({
  components: { Container, Heading, Link, Text },
  sizes: {
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1920px",
    },
  },
  breakpoints: {
    base: 0,
    sm: 640,
    md: 832,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  space,
  fonts,
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.625rem",
    "3xl": "1.875rem",
    "4xl": "2rem",
    "5xl": "2.25rem",
    "6xl": "3rem",
    "7xl": "3.75rem",
    "8xl": "4.375rem",
    "9xl": "5rem",
  },
  fontWeights: {
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    normal: "normal",
    compact: "0.9",
    none: "1",
    shortest: "1.125",
    shorter: "1.25",
    short: "1.375",
    base: "1.5",
    tall: "1.625",
    taller: "2",
  },
  zIndices: { projectSection: 9, header: 10, loader: 1000 },
  colors: {
    black: "#000",
    white: "#fff",
  },
});
