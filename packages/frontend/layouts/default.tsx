import { Box, Button, Container, Flex, Spacer, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode, useEffect } from "react";
import Logo from "../components/logo";
import { useAccount } from "../hooks/useAccount";

const Layout = (props: {
  children: ReactNode;
  walletNotRequired?: boolean;
}) => {
  const { account, connectWallet } = useAccount();

  useEffect(() => {
    if (props.walletNotRequired) return;

    connectWallet();
  }, [props.walletNotRequired, connectWallet]);

  return (
    <Box h="calc(100vh)" background={"black"}>
      <Container maxWidth={"6xl"}>
        <Flex>
          <NextLink href={"/app"}>
            <Box minW={240} maxW={320} py={4} cursor="pointer">
              <Logo height={12} />
            </Box>
          </NextLink>
          <Spacer />
          {!props.walletNotRequired && (
            <Box mt={6}>
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
      <Container maxWidth={"6xl"}>{props.children}</Container>
    </Box>
  );
};

export default Layout;
