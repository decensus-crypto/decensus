// FormDeployButton component is dynamically imported because "lit-ceramic-sdk" used in it emits error when loaded in server-side.
import dynamic from "next/dynamic";
const FormDeployButoton = dynamic(
  () => import("../../components/FormDeployButton"),
  {
    ssr: false,
  }
);

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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import type { ReactElement } from "react";
import React, { useState } from "react";
import Layout from "../../layouts/default";

type Form = {
  title: string;
  url: string;
};

const FormRow = (props: Form) => {
  return (
    <Tr>
      <Td>
        <Text fontSize="md" color="white">
          {props.title}
        </Text>
      </Td>
      <Td w={16}>
        <Text fontSize="md" color="white">
          210 Answered
        </Text>
      </Td>
      <Td w={16}>
        <a href={props.url} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" color="white">
            Get Link
          </Button>
        </a>
      </Td>
    </Tr>
  );
};

const AppRoot = (page: ReactElement) => {
  const [forms, setForms] = useState<Form[]>([]);

  // Form Dialog
  const initialRef = React.useRef(null);
  const [title, setTitle] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const clickNew = () => {
    setTitle("");
    setContractAddress("");
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
          <TableContainer>
            <Table size="lg">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {forms.map((form, index) => (
                  <FormRow
                    key={`form_row_${index}`}
                    title={form.title}
                    url={form.url}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
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
                formName={title}
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppRoot;
