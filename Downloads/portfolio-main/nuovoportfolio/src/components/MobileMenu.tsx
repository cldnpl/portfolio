import {
  Button,
  chakra,
  Container,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { NavLinks } from "@/components/NavLinks";
import type { NavLinkItem } from "@/data/site";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  links: NavLinkItem[];
  socials: NavLinkItem[];
};

export const MobileMenu = ({ isOpen, onClose, links, socials }: MobileMenuProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="full" blockScrollOnMount={false}>
    <ModalOverlay />
    <ModalContent>
      <Container display="flex" justifyContent="flex-end" py="space-36">
        <CloseButton onClick={onClose}>close</CloseButton>
      </Container>
      <ModalBody>
        <NavLinks links={links} onNavigate={onClose} />
      </ModalBody>
      <Container>
        <Divider bg="black" height="1px" />
      </Container>
      <ModalFooter display="flex" justifyContent="space-between">
        {socials.map((social, i) => (
          <Link key={i} href={social.href} target="_blank" fontWeight={200}>
            {social.title}
          </Link>
        ))}
      </ModalFooter>
    </ModalContent>
  </Modal>
);

const CloseButton = chakra(Button, {
  baseStyle: {
    textTransform: "uppercase",
    display: { base: "block", md: "none" },
    background: "none",
    fontWeight: "light",
    border: "1px solid",
    borderColor: "black",
    borderRadius: "unset",
    fontSize: "sm",
  },
});
