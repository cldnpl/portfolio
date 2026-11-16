import { Box, BoxProps, Container } from "@chakra-ui/react";
import { forwardRef } from "react";

const spacing = {
  none: "0",
  extraSmall: { base: "space-34", md: "space-96" },
  small: { base: "space-64", md: "space-104" },
  medium: { base: "space-72", md: "space-120" },
  large: { base: "space-104", md: "space-168" },
  extraLarge: { base: "space-188", md: "space-232" },
};

export type SectionSpacing = keyof typeof spacing;

type SectionProps = BoxProps & {
  spacingTop?: SectionSpacing;
  spacingBottom?: SectionSpacing;
  /** Full bleed: children are laid out by the caller instead of a Container. */
  isFullScreen?: boolean;
};

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, spacingTop, spacingBottom, isFullScreen, ...rest }, ref) => (
    <Box
      as="section"
      position="relative"
      mt={spacing[spacingTop || "none"]}
      mb={spacing[spacingBottom || "none"]}
      ref={ref}
      {...rest}
    >
      {isFullScreen ? <>{children}</> : <Container>{children}</Container>}
    </Box>
  ),
);

Section.displayName = "Section";
