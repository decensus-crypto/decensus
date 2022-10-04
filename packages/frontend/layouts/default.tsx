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
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect } from "react";
import Logo from "../components/logo";
import { CHAIN_NAME } from "../constants/constants";
import { useAccount } from "../hooks/useAccount";

const Layout = (props: {
  children: ReactNode;
  walletNotRequired?: boolean;
}) => {
  const {
    account,
    isLoadingAccount,
    isWrongChain,
    connectWallet,
    disconnectWallet,
  } = useAccount();
  const wrongNetworkModal = useDisclosure();

  useEffect(() => {
    if (props.walletNotRequired) return;

    connectWallet();
  }, [props.walletNotRequired, connectWallet]);

  useEffect(() => {
    if (isWrongChain) wrongNetworkModal.onOpen();
  }, [isWrongChain, wrongNetworkModal]);

  const onLogout = async () => {
    await disconnectWallet();
    window.location.reload();
  };

  return (
    <Box h="calc(100vh)" background={"black"}>
      <Container maxWidth="6xl">
        <Flex align="center">
          <NextLink href={"/app"}>
            <Box minW={200} maxW={320} py={4} cursor="pointer">
              <Logo height={12} />
            </Box>
          </NextLink>
          <Spacer />
          {!props.walletNotRequired && (
            <Box>
              {account ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    w="160px"
                    rightIcon={<ChevronDownIcon />}
                  >
                    <Text
                      as="span"
                      w="120px"
                      overflowX="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      {account.slice(0, 12)}...
                    </Text>
                  </MenuButton>
                  <MenuList background="black" color="white" maxW="150px">
                    <MenuItem onClick={onLogout}>Log Out</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  size="sm"
                  w="160px"
                  variant="outline"
                  color="white"
                  onClick={connectWallet}
                  disabled={isLoadingAccount}
                >
                  {isLoadingAccount ? <Spinner size="sm" /> : "Connect Wallet"}
                </Button>
              )}
            </Box>
          )}
        </Flex>
      </Container>
      {!isWrongChain && (
        <Container maxWidth={"6xl"}>{props.children}</Container>
      )}
      <Modal
        {...wrongNetworkModal}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unsupported network</ModalHeader>
          <ModalBody mb={6}>
            Please switch to{" "}
            <strong>
              {CHAIN_NAME.slice(0, 1).toUpperCase() +
                CHAIN_NAME.slice(1).toLowerCase()}
            </strong>{" "}
            in your wallet app and reload the page.
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Layout;
