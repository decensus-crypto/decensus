import { Box, Button, Container, Flex, Spacer } from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode } from "react";
import Logo from "../components/logo";

const Layout = (props: { children: ReactNode }) => {
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
            <NextLink href="/app">
              <Button size="sm" colorScheme="pink">
                Launch APP
              </Button>
            </NextLink>
          </Box>
        </Flex>
      </Container>
      <Container as="main" maxWidth="6xl">
        {props.children}
      </Container>
    </Box>
  );
};
export default Layout;
