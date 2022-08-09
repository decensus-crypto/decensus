import FormDeployButoton from "../../components/FormDeployButton";
import FormList from "../../components/FormList";

import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";
import { TEST_NFT_CONTRACT_ADDRESS } from "../../constants/constants";
import Layout from "../../layouts/default";
import { fetchNftBaseInfo } from "../../utils/zdk";

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
  // Form Dialog
  const initialRef = React.useRef(null);
  const [title, setTitle] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isLoadingNftName, setIsLoadingNftName] = useState(false);
  const [loadedNftName, setLoadedNftName] = useState(false);
  const [nftName, setNftName] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const clickNew = () => {
    setTitle("");
    setContractAddress("");
    onOpen();
  };

  useEffect(() => {
    (async () => {
      if (contractAddress.length === 0) {
        setIsLoadingNftName(false);
        setNftName(null);
        setLoadedNftName(false);
        return;
      }
      if (!contractAddress.startsWith("0x") || contractAddress.length !== 42) {
        setIsLoadingNftName(false);
        setNftName("");
        setLoadedNftName(false);
        return;
      }
      if (isLoadingNftName || loadedNftName) return;

      try {
        setIsLoadingNftName(true);
        const baseInfo = await fetchNftBaseInfo(contractAddress);
        if (!baseInfo || !baseInfo.name) {
          setNftName("");
          return;
        }

        setNftName(baseInfo.name);
      } catch (error: any) {
        console.error(error);
        setNftName("");
      } finally {
        setIsLoadingNftName(false);
        setLoadedNftName(true);
      }
    })();
  }, [contractAddress, isLoadingNftName, loadedNftName, nftName]);

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
        <ModalContent color="white" background="gray.700">
          <ModalHeader>Create new form with our template</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Form Title</FormLabel>
              <Input
                required
                ref={initialRef}
                placeholder="My best form ever"
                value={title}
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel display="flex" justifyContent="stretch" mr="0">
                NFT Contract Address
                <Spacer />
                <Button
                  size="xs"
                  onClick={() => setContractAddress(TEST_NFT_CONTRACT_ADDRESS)}
                  color="gray.500"
                  borderColor="gray.500"
                  variant="outline"
                >
                  Input test address
                </Button>
              </FormLabel>
              <Input
                required
                placeholder="0xabcd..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                mb={1}
              />
              <NftName nftName={nftName} isLoadingNftName={isLoadingNftName} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Flex>
              <Button size="md" variant="outline" onClick={onClose}>
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
