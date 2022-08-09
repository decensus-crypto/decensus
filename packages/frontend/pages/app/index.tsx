import FormList from "../../components/FormList";

import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import FormCreationModal from "../../components/FormCreationModal";
import Layout from "../../layouts/default";

const NftName = (props: {
  nftName: string | null;
  isLoadingNftName: boolean;
}) => {
  if (props.isLoadingNftName) {
    return <Spinner size="sm" />;
  } else if (props.nftName == null) {
    return <></>;
  } else if (props.nftName.length === 0) {
    return (
      <Text color="gray.500" display="flex" alignItems="center">
        <WarningTwoIcon mr={1} />
        No NFT project found for the address
      </Text>
    );
  } else {
    return (
      <Text display="flex" alignItems="center">
        <CheckIcon mr={1} fontWeight="100" color="green.500" />
        Project found: {props.nftName}
      </Text>
    );
  }
};

const AppRoot = (page: ReactElement) => {
  // modal control
  const formCreationModal = useDisclosure();

  const clickNew = () => {
    formCreationModal.onOpen();
  };

  return (
    <>
      <Layout>
        <Box w={"full"} mb={32}>
          <Flex>
            <Heading as="h2" size="md" fontWeight="light" color="white">
              My Forms
            </Heading>
            <Spacer />
            <Button
              size="sm"
              variant="outline"
              color="#FC8CC9"
              onClick={clickNew}
            >
              Create New Form
            </Button>
          </Flex>
          <Grid mt={8} templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 4 }}>
              <Flex>
                <Spacer />
                <ButtonGroup isAttached variant="outline"></ButtonGroup>
              </Flex>
            </GridItem>
          </Grid>

          <FormList />
        </Box>
      </Layout>

      <FormCreationModal {...formCreationModal} />
    </>
  );
};

export default AppRoot;
