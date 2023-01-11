import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactNode } from "react";
import Logo from "../components/logo";

const Layout = (props: { children: ReactNode }) => {
  return (
    <Box h="calc(100vh)" background="black">
      <Box as="header">
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
      </Box>
      <Box as="main">{props.children}</Box>
      <Box as="footer" backgroundColor="gray.800">
        <Container maxWidth="6xl">
          <Grid templateColumns="repeat(12, 1fr)" gap={4} py={8}>
            <GridItem colSpan={{ base: 12, sm: 4 }}>
              <NextLink href="/">
                <Box minW={200} maxW={320} cursor="pointer">
                  <Logo height={12} />
                </Box>
              </NextLink>
            </GridItem>
            <GridItem colSpan={{ base: 12, sm: 8 }}>
              <Heading as="h3" color="white" size="md" fontWeight="bold">
                Links
              </Heading>
              <Grid templateColumns="repeat(12, 1fr)" gap={4} py={4}>
                <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                  <NextLink href="/">
                    <Text color="white" fontWeight="light">
                      Docs
                    </Text>
                  </NextLink>
                </GridItem>
                <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                  <NextLink href="/">
                    <Text color="white" fontWeight="light">
                      FAQs
                    </Text>
                  </NextLink>
                </GridItem>
                <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                  <NextLink href="/">
                    <Text color="white" fontWeight="light">
                      Github
                    </Text>
                  </NextLink>
                </GridItem>
                <GridItem colSpan={{ base: 12, sm: 6, md: 4, lg: 2 }}>
                  <NextLink href="/">
                    <Text color="white" fontWeight="light">
                      Contact
                    </Text>
                  </NextLink>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
export default Layout;
