import {
  Box,
  Button,
  Container,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
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

const Layout = (props: {
  children: ReactNode;
  walletNotRequired?: boolean;
}) => {
  const { account, isWrongChain, connectWallet } = useAccount();
  const wrongNetworkModal = useDisclosure();

  useEffect(() => {
    if (props.walletNotRequired) return;

    connectWallet();
  }, [props.walletNotRequired, connectWallet]);

  useEffect(() => {
    if (isWrongChain) wrongNetworkModal.onOpen();
  }, [isWrongChain, wrongNetworkModal]);

  return (
    <Box h="calc(100vh)" background={"black"}>
      <Container maxWidth={"6xl"}>
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
                <Text
                  color="white"
                  maxW="150px"
                  overflowX="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {account}
                </Text>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  color="white"
                  onClick={connectWallet}
                >
                  Connect Wallet
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
        <ModalContent color="white" background="gray.700">
          <ModalHeader>Unsupported network</ModalHeader>
          <ModalBody mb={6}>
            Please switch to <strong>{CHAIN_NAME}</strong> in your wallet app
            and reload the page.
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Layout;
