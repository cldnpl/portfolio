import { Box, chakra, Flex, Link, SimpleGrid, Text } from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { Magnetic } from "@/components/Magnetic";
import { useUi } from "@/data/ui";
import { rem } from "@/theme/rem";

/**
 * Web3Forms relays the message to the inbox the key was issued for
 * (napolitano.claudia@icloud.com), with no backend of our own. The key is
 * public by design: it can only deliver to that address, never read anything
 * back. It is the same key the previous portfolio used. To rotate it, issue a
 * new one at https://web3forms.com and replace it here.
 */
const ACCESS_KEY = "31f5603a-2a63-4b0f-8664-0592d8171fd9";
const ENDPOINT = "https://api.web3forms.com/submit";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

type Status = "idle" | "sending" | "sent" | "failed";

const Field = chakra("input", {
  baseStyle: {
    width: "100%",
    bg: "transparent",
    border: "none",
    borderBottom: "1px solid",
    borderColor: "whiteAlpha.300",
    borderRadius: 0,
    color: "white",
    fontFamily: "body",
    fontWeight: "light",
    fontSize: `clamp(${rem(18)}, 1.6vw, ${rem(24)})`,
    lineHeight: "short",
    py: "space-12",
    outline: "none",
    transition: "border-color 0.3s ease",
    _placeholder: { color: "whiteAlpha.400" },
    _focus: { borderColor: "white" },
    _autofill: { WebkitTextFillColor: "white", transition: "background-color 9999s" },
  },
});

const Label = ({ children, htmlFor }: { children: string; htmlFor: string }) => (
  <Text
    as="label"
    htmlFor={htmlFor}
    display="block"
    textTransform="uppercase"
    fontSize="xs"
    letterSpacing="0.2em"
    color="whiteAlpha.600"
  >
    {children}
  </Text>
);

type ContactFormProps = { email: string; isInView: boolean };

export const ContactForm = ({ email, isInView }: ContactFormProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const t = useUi().form;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // kept now: React clears currentTarget once the handler awaits
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio: ${data.get("name") ?? ""}`,
          from_name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck"),
        }),
      });
      // Web3Forms can answer 200 with { success: false }
      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
      if (!response.ok || result?.success === false) throw new Error(`HTTP ${response.status}`);
      setStatus("sent");
      form.reset();
    } catch (error) {
      console.error("[contact] send failed", error);
      setStatus("failed");
    }
  };

  const reveal = (delay: number) => ({
    opacity: isInView ? 1 : 0,
    transform: `translateY(${isInView ? 0 : 20}px)`,
    transition: `all 0.6s ${EASE} ${delay}s`,
  });

  const note =
    status === "sending"
      ? t.sendingNote
      : status === "sent"
        ? t.sent
        : status === "failed"
          ? t.failed
          : t.direct;

  return (
    <Box as="form" onSubmit={onSubmit} width="100%">
      {/* honeypot: people never see it, bots fill it in */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX="space-48" spacingY={{ base: "space-32", md: "space-40" }}>
        <Box {...reveal(0.4)}>
          <Label htmlFor="contact-name">{t.name}</Label>
          <Field id="contact-name" name="name" type="text" placeholder={t.namePlaceholder} autoComplete="name" required />
        </Box>
        <Box {...reveal(0.45)}>
          <Label htmlFor="contact-email">{t.email}</Label>
          <Field id="contact-email" name="email" type="email" placeholder={t.emailPlaceholder} autoComplete="email" required />
        </Box>
        <Box gridColumn={{ md: "1 / -1" }} {...reveal(0.5)}>
          <Label htmlFor="contact-message">{t.message}</Label>
          <Field
            as="textarea"
            id="contact-message"
            name="message"
            placeholder={t.messagePlaceholder}
            rows={3}
            resize="none"
            required
          />
        </Box>
      </SimpleGrid>

      <Flex
        mt={{ base: "space-32", md: "space-40" }}
        flexDir={{ base: "column-reverse", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
        gap="space-24"
        {...reveal(0.55)}
      >
        <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.1em" color="whiteAlpha.600" aria-live="polite">
          {note}{" "}
          {status !== "sent" && status !== "sending" && (
            <Link href={`mailto:${email}`} color="white" _after={{ bg: "white" }} textTransform="none" letterSpacing="0.02em">
              {email}
            </Link>
          )}
        </Text>
        <Magnetic>
          <Box
            as="button"
            type="submit"
            disabled={status === "sending"}
            display="inline-flex"
            alignItems="center"
            gap="space-12"
            px="space-32"
            py="space-16"
            border="1px solid"
            borderColor="white"
            bg="transparent"
            color="white"
            fontFamily="body"
            fontSize="sm"
            fontWeight="medium"
            textTransform="uppercase"
            letterSpacing="0.15em"
            cursor="pointer"
            transition="background-color 0.3s ease, color 0.3s ease"
            _hover={{ bg: "white", color: "black" }}
            _disabled={{ opacity: 0.5, cursor: "wait" }}
          >
            {status === "sending" ? t.sending : t.send}
            <Box as="span" aria-hidden>
              →
            </Box>
          </Box>
        </Magnetic>
      </Flex>
    </Box>
  );
};
