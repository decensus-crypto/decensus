import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
} from "@chakra-ui/react";
import NextLink from "next/link";
import type { ReactElement } from "react";
import Layout from "../layouts/default";

const Root = (page: ReactElement) => {
  return (
    <Layout>
      <Box w={"full"} mb={32}>
        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Box mt={36}>
              <Heading as="h2" color="white" size="lg" fontWeight="bold">
                Metabolism Hackathon
              </Heading>
              <Heading as="h3" color="white" size="sm" fontWeight="light">
                Metabolism Hackathon
              </Heading>
            </Box>
            <Box mt={8}>
              <NextLink href="/app">
                <Button size="lg" variant="outline" color="white">
                  Launch App
                </Button>
              </NextLink>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Center mt={16}>
              <Image
                borderRadius={8}
                objectFit="cover"
                src="/lp.jpg"
                alt="LP"
              />
            </Center>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Root;
