import { Box, Button, Center, Grid, GridItem, Heading } from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import Layout from "../layouts/default";

const Home = () => {
  return (
    <Layout>
      <Box w="full" mb={32}>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Box mt={36}>
              <Heading as="h1" color="white" size="xl" fontWeight="bold">
                decensus
              </Heading>
              <Heading as="h3" color="white" size="sm" fontWeight="light">
                Know your NFT community in a decentralized way
              </Heading>
            </Box>
            <Box mt={8}>
              <NextLink href="/app">
                <Button size="lg" colorScheme="pink">
                  Launch App
                </Button>
              </NextLink>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Center mt={16} w="100%" h="100%" minH={40} position="relative">
              <Image
                style={{ objectFit: "contain" }}
                src="/lp.jpg"
                alt="LP"
                fill
              />
            </Center>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Home;
