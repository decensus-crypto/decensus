import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { TEST_NFT_CONTRACT_ADDRESS } from "../../constants/constants";
import { useReservoir } from "../../hooks/useReservoir";
import { useWallet } from "../../hooks/useWallet";
import { useZora } from "../../hooks/useZora";

const NftFormControl = (props: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [nftAddress, setNftAddress] = useState(props.value);
  const { wallet } = useWallet();
  const { nftName, isNftNameLoading, setNftName, fetchNftName } = useZora();
  const { holders, isLoadingHolders, setHolders, fetchHolders } =
    useReservoir();

  const isNftddressFormatValid = useMemo(
    () => nftAddress.startsWith("0x") && nftAddress.length === 42,
    [nftAddress]
  );

  const isHoldersIncludeWallet = useMemo(() => {
    return holders.some((a) => a === wallet);
  }, [holders, wallet]);

  const isLoading = useMemo(() => {
    return isNftNameLoading || isLoadingHolders;
  }, [isNftNameLoading, isLoadingHolders]);

  useEffect(() => {
    (async () => {
      setNftName(null);
      setHolders([]);
      props.onChange(nftAddress);
      if (isNftddressFormatValid) {
        await fetchNftName(nftAddress);
        await fetchHolders(nftAddress);
      }
    })();
  }, [nftAddress]);

  return (
    <>
      <FormControl mt={4}>
        <FormLabel size="sm">NFT Contract Address</FormLabel>
        <Input
          required
          isInvalid={!isNftddressFormatValid}
          placeholder="0xabcd..."
          value={nftAddress}
          onChange={(evt) => setNftAddress(evt.target.value)}
        />
      </FormControl>
      <Button
        variant="ghost"
        size="xs"
        onClick={() => setNftAddress(TEST_NFT_CONTRACT_ADDRESS)}
      >
        User Sample Address
      </Button>
      {isNftddressFormatValid && (
        <Card bg="gray.100" p={1} mt={2}>
          <CardBody p={1}>
            <Flex align="center">
              {isLoading && <Text fontSize="sm">Loading...</Text>}
              {!isLoading && nftName && (
                <>
                  <CheckIcon />
                  <Text ml={2} fontSize="sm">
                    Project Found: {nftName}
                  </Text>
                </>
              )}
              {!isLoading && !nftName && (
                <>
                  <NotAllowedIcon />
                  <Text ml={2} fontSize="sm">
                    Project Not Found
                  </Text>
                </>
              )}
            </Flex>
            <Flex align="center">
              {isLoading && <Text fontSize="sm">Loading...</Text>}
              {!isLoading && holders && (
                <>
                  <CheckIcon />
                  <Text ml={2} fontSize="sm">
                    Token Holders: {holders.length}
                  </Text>
                </>
              )}
              {!isLoading && !holders && (
                <>
                  <NotAllowedIcon />
                  <Text ml={2} fontSize="sm">
                    Token Holders Not Found
                  </Text>
                </>
              )}
            </Flex>
            <Flex align="center">
              <Text fontSize="sm">
                {isLoading && "Loading..."}
                {!isLoading && isHoldersIncludeWallet && "including you!"}
                {!isLoading && !isHoldersIncludeWallet && "you have no tokens"}
              </Text>
            </Flex>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default function NewFormInfoDialog(props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    contractAddress: string
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const isTitleFormatValid = 0 < title.length;
  const isDescriptionFormatValid = 0 < description.length;
  const isContractAddressFormatValid =
    contractAddress.startsWith("0x") && contractAddress.length === 42;

  const clickSubmit = () => {
    if (!isTitleFormatValid) {
      console.log("title is not valid");
      return;
    }
    if (!isDescriptionFormatValid) {
      console.log("description is not valid");
      return;
    }
    if (!isContractAddressFormatValid) {
      console.log("contractAddress is not valid");
      return;
    }

    props.onClose();
    props.onSubmit(title, description, contractAddress);
  };

  return (
    <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h2" fontWeight="light" color="gray">
          Create New Form
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel size="sm">Form Title</FormLabel>
            <Input
              required
              isInvalid={!isTitleFormatValid}
              placeholder="My best form ever"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel size="sm">Form Description</FormLabel>
            <Textarea
              required
              isInvalid={!isDescriptionFormatValid}
              placeholder="A survey to analyze the demography of NFT holders"
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
            />
          </FormControl>
          <Box mt={4}>
            <NftFormControl
              value={contractAddress}
              onChange={(val) => setContractAddress(val)}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%" mt={4}>
            <GridItem colSpan={{ base: 3 }}>
              <Button
                size="sm"
                w="100%"
                variant="ghost"
                onClick={props.onClose}
              >
                Cancel
              </Button>
            </GridItem>
            <GridItem colSpan={{ base: 9 }}>
              <Button
                size="sm"
                w="100%"
                onClick={clickSubmit}
                colorScheme="pink"
              >
                Next
              </Button>
            </GridItem>
          </Grid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
