import { Box, Button, Container, Flex, Spacer, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect } from "react";
import Logo from "../components/logo";
import { useAccount } from "../hooks/useAccount";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  const { account, connectWallet, checkWallet } = useAccount();

  useEffect(() => {
    checkWallet();
  }, [checkWallet]);

  return (
    <Box h="calc(100vh)" background={"black"}>
      <Container maxWidth={"6xl"}>
        <Flex>
          <NextLink href="/">
            <Box minW={240} maxW={320} py={4}>
              <Logo height={12} />
            </Box>
          </NextLink>
          <Spacer />
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
        </Flex>
      </Container>
      <Container maxWidth={"6xl"}>{children}</Container>
    </Box>
  );
};

export default Layout;
