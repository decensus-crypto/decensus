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
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect } from "react";
import Logo from "../components/logo";
import { CHAIN_NAME } from "../constants/constants";
import { useAccount } from "../hooks/useAccount";

const IncorrectChainDialog = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <ModalOverlay />
      <ModalContent bg="gray.700">
        <ModalHeader as="h2" fontWeight="light" color="white">
          Unsupported Network
        </ModalHeader>
        <ModalBody>
          <Text>Please switch to</Text>
          <Text>{CHAIN_NAME.slice(0, 1).toUpperCase() + CHAIN_NAME.slice(1).toLowerCase()}</Text>
          <Text> in your wallet app and reload the page. </Text>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Layout = (props: { children: ReactNode }) => {
  const { account, isLoadingAccount, isWrongChain, connectWallet, disconnectWallet } = useAccount();
  const wrongNetworkModal = useDisclosure();

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    if (isWrongChain) wrongNetworkModal.onOpen();
  }, [isWrongChain, wrongNetworkModal]);

  const clickConnect = async () => {
    await connectWallet();
  };
  const clickDisconnect = async () => {
    await disconnectWallet();
    window.location.href = "/";
  };

  return (
    <Box h="calc(100vh)" background="black">
      <Container maxWidth="6xl">
        <Flex align="center">
          <NextLink href="/">
            <Box minW={200} maxW={320} py={4} cursor="pointer">
              <Logo height={12} />
            </Box>
          </NextLink>
          <Spacer />
          <Box>
            {account ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="outline"
                  size="sm"
                  colorScheme="pink"
                >
                  {account && account.slice(0, 12)}...
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={clickDisconnect}>Disconnect</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button size="sm" colorScheme="pink" onClick={clickConnect}>
                Connect Wallet
              </Button>
            )}
          </Box>
        </Flex>
      </Container>
      {!isWrongChain && <Container maxWidth="6xl">{props.children}</Container>}
      <IncorrectChainDialog
        isOpen={wrongNetworkModal.isOpen}
        onOpen={wrongNetworkModal.onOpen}
        onClose={wrongNetworkModal.onClose}
      />
    </Box>
  );
};
export default Layout;
