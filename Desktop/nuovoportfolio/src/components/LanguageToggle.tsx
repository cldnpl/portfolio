import { Box, Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { useUi } from "@/data/ui";
import { type Lang, useLanguage } from "@/lib/language";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "it", label: "IT" },
];

/** "EN / IT" in the header: the active one in full ink, the other faded. */
export const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  const ui = useUi();
  return (
    <Flex role="group" aria-label={ui.language} data-intro="nav-item" alignItems="center" gap="6px">
      {LANGS.map(({ code, label }, i) => (
        <Fragment key={code}>
          {i > 0 && (
            <Text as="span" opacity={0.3} aria-hidden>
              /
            </Text>
          )}
          <Box
            as="button"
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            bg="transparent"
            border="none"
            p={0}
            color="inherit"
            cursor="pointer"
            fontSize="inherit"
            letterSpacing="0.04em"
            opacity={lang === code ? 1 : 0.4}
            transition="opacity 0.3s ease"
            _hover={{ opacity: 1 }}
          >
            {label}
          </Box>
        </Fragment>
      ))}
    </Flex>
  );
};
