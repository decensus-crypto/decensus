import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect } from "react";
import Logo from "../components/logo";
import { CHAIN_NAME } from "../constants/constants";
import { useWallet } from "../hooks/useWallet";

const IncorrectChainDialog = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  return (
    <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h2" fontWeight="light" color="gray">
          Unsupported Network
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Please switch to</Text>
          <Text>
            {CHAIN_NAME.slice(0, 1).toUpperCase() +
              CHAIN_NAME.slice(1).toLowerCase()}
          </Text>
          <Text> in your wallet app and reload the page. </Text>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Layout(props: { children: ReactNode }) {
  const {
    isOpen: isOpenIncorrect,
    onOpen: onOpenIncorrect,
    onClose: onCloseIncorrect,
  } = useDisclosure();
  const { wallet, walletStatus, connectWallet, disconnectWallet } = useWallet();

  useEffect(() => {
    if (wallet) return;
    connectWallet();
  }, []);

  const clickConnect = () => {
    if (wallet) return;
    connectWallet();
  };

  const clickDisconnect = () => {
    if (!wallet) return;
    disconnectWallet();
  };
  return (
    <>
      <Box h="calc(100vh)" background="black">
        <Container as="header" maxWidth="6xl">
          <Flex align="center">
            <NextLink href="/">
              <Box minW={200} maxW={320} py={4} cursor="pointer">
                <Logo height={12} />
              </Box>
            </NextLink>
            <Spacer />
            <NextLink href="/app">
              {walletStatus === "connected" && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    colorScheme="pink"
                  >
                    {wallet && wallet.slice(0, 12)}...
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={clickDisconnect}>Disconnect</MenuItem>
                  </MenuList>
                </Menu>
              )}
              {walletStatus === "incorrect_network" && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    variant="outline"
                    size="sm"
                    colorScheme="pink"
                  >
                    Unsupported network
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={clickDisconnect}>Disconnect</MenuItem>
                  </MenuList>
                </Menu>
              )}
              {walletStatus === "connecting" && (
                <Button size="sm" colorScheme="pink" disabled>
                  <Spinner size="sm" />
                </Button>
              )}
              {walletStatus === "disconnected" && (
                <Button size="sm" colorScheme="pink" onClick={clickConnect}>
                  Connect Wallet
                </Button>
              )}
            </NextLink>
          </Flex>
        </Container>
        <Container as="main" maxWidth="6xl">
          {props.children}
        </Container>
      </Box>
      <IncorrectChainDialog
        isOpen={isOpenIncorrect}
        onOpen={onOpenIncorrect}
        onClose={onCloseIncorrect}
      />
    </>
  );
}
