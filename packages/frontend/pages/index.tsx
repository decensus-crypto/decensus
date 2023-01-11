import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { TbCheckbox, TbLock, TbLockAccess, TbShape } from "react-icons/tb";
import Layout from "../layouts/default";

const Home = () => {
  return (
    <Layout>
      <Box as="section" w="full" h={{ base: 320, md: 600 }}>
        <Container maxWidth="6xl">
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Box mt={{ base: 16, md: 36 }}>
                <Heading as="h1" color="white" size="3xl" fontWeight="light">
                  Decentralized
                  <br />
                  Forms
                </Heading>
                <Heading
                  as="h3"
                  color="white"
                  size="md"
                  fontWeight="light"
                  mt={4}
                >
                  Token-gated forms to understand your community
                </Heading>
              </Box>
              <Box mt={8}>
                <Flex>
                  <NextLink href="/app">
                    <Button
                      width={160}
                      size="lg"
                      fontWeight="light"
                      colorScheme="pink"
                    >
                      Create Form
                    </Button>
                  </NextLink>
                  <NextLink href="/app">
                    <Button
                      ml={2}
                      width={160}
                      size="lg"
                      variant="outline"
                      fontWeight="light"
                      colorScheme="pink"
                    >
                      View Docs
                    </Button>
                  </NextLink>
                </Flex>
              </Box>
            </GridItem>
            <GridItem
              colSpan={{ base: 12, md: 6 }}
              display={{ base: "none", md: "block" }}
            >
              <Image src="/lp.jpg" alt="LP" rounded={12} />
            </GridItem>
          </Grid>
        </Container>
      </Box>
      <Box as="section" w="full" backgroundColor="gray.800">
        <Container maxWidth="6xl">
          <Grid templateColumns="repeat(12, 1fr)" gap={4} py={24}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Heading as="h1" color="white" size="xl" fontWeight="light">
                What is Decensus?
              </Heading>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Text color="white" fontSize="lg" fontWeight="light">
                Decensus is a free and <b>open-source</b> decentralized
                application for creating token-gated forms, with privacy in
                mind. It is designed for communities, decentralized or not, who
                are interested in gathering explicit information from their
                members such as opinions, personal information or preferences.
                Decensus was created by Centiv to address the lack of solutions
                in this space, and was developed during the Metabolisms&amp; ETH
                Global hackathon in 2022, where it finished finalist.
              </Text>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      <Box as="section" w="full">
        <Container maxWidth="6xl">
          <Grid templateColumns="repeat(12, 1fr)" gap={4} py={24}>
            <GridItem colSpan={{ base: 12 }}>
              <Heading as="h1" color="white" size="3xl" fontWeight="light">
                Features
              </Heading> 
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Grid templateColumns="repeat(12, 1fr)" gap={2}>
                <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                  <Card py={8}>
                    <Text color="pink.600">
                      <TbShape size={64} />
                    </Text>
                    <Heading
                      as="h4"
                      color="white"
                      size="md"
                      fontWeight="bold"
                      py={4}
                    >
                      Decentralized
                    </Heading>
                    <Text color="white" fontSize="lg" fontWeight="light">
                      Decensus is built on the Polygon blockchain, benefiting
                      from censorship-resistance, allowing wallet log in and
                      unstoppable servicing.
                    </Text>
                  </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                  <Card py={8}>
                    <Text color="pink.600">
                      <TbLockAccess size={64} />
                    </Text>
                    <Heading
                      as="h4"
                      color="white"
                      size="md"
                      fontWeight="bold"
                      py={4}
                    >
                      Token-gated
                    </Heading>
                    <Text color="white" fontSize="lg" fontWeight="light">
                      Form creators can specify any NFT collection that form
                      respondents must be holders of in order to access the
                      form.
                    </Text>
                  </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                  <Card py={8}>
                    <Text color="pink.600">
                      <TbCheckbox size={64} />
                    </Text>
                    <Heading
                      as="h4"
                      color="white"
                      size="md"
                      fontWeight="bold"
                      py={4}
                    >
                      Collectible questions and answers
                    </Heading>
                    <Text color="white" fontSize="lg" fontWeight="light">
                      Forms and answer sets are represented as NFT collections
                      and items, respectively, making them collectible and
                      valuable. In addition, all form answers are encrypted and
                      only visible to the form creator, ensuring privacy for
                      respondents.
                    </Text>
                  </Card>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6, lg: 3 }}>
                  <Card py={8}>
                    <Text color="pink.600">
                      <TbLock size={64} />
                    </Text>
                    <Heading
                      as="h4"
                      color="white"
                      size="md"
                      fontWeight="bold"
                      py={4}
                    >
                      Privacy
                    </Heading>
                    <Text color="white" fontSize="lg" fontWeight="light">
                      Form answers are encrypted and only visible to the form
                      creator, ensuring privacy for respondents.
                    </Text>
                  </Card>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
