// FormDeployButton component is dynamically imported because "lit-ceramic-sdk" used in it emits error when loaded in server-side.
import dynamic from "next/dynamic";
const FormDeployButoton = dynamic(
  () => import("../../components/FormDeployButton"),
  {
    ssr: false,
  }
);
const FormList = dynamic(() => import("../../components/FormList"), {
  ssr: false,
});

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { TEST_NFT_CONTRACT_ADDRESS } from "../../constants/constants";
import Layout from "../../layouts/default";

const AppRoot = (page: ReactElement) => {
  // Form Dialog
  const initialRef = React.useRef(null);
  const [title, setTitle] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const clickNew = () => {
    setTitle("");
    setContractAddress(TEST_NFT_CONTRACT_ADDRESS);
    onOpen();
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
              color="white"
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

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new form with our template</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Form Name</FormLabel>
              <Input
                required
                ref={initialRef}
                placeholder="My best form ever"
                value={title}
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>NFT Contract Address</FormLabel>
              <Input
                required
                placeholder="0xabcd..."
                value={contractAddress}
                onChange={(evt) => setContractAddress(evt.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Flex>
              <Button size="md" variant="text" color="black" onClick={onClose}>
                Cancel
              </Button>
              <FormDeployButoton
                nftAddress={contractAddress}
                title={title}
                onDeployComplete={onClose}
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppRoot;
