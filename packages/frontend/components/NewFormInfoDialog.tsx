import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
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
import { useState } from "react";
import { TEST_NFT_CONTRACT_ADDRESS } from "../constants/constants";
import { useAccount } from "../hooks/useAccount";
import { useTokenHolders } from "../hooks/useTokenHolders";
import { fetchNftBaseInfo } from "../utils/zdk";

const NftFormControl = (props: {
  value: string;
  onChange: (val: string, isValid: boolean) => void;
}) => {
  const { account } = useAccount();
  const { tokenHolders, isLoadingTokenHolders, fetchHolders } = useTokenHolders();
  const [contractAddress, setContractAddress] = useState("");
  const [isLoadingNftName, setIsLoadingNftName] = useState(false);
  const [loadedNftName, setLoadedNftName] = useState(false);
  const [nftName, setNftName] = useState<string | null>(null);

  const isContractAddressFormatValid = useMemo(() => {
    return contractAddress.startsWith("0x") && contractAddress.length === 42;
  }, [contractAddress]);

  const isHoldersIncludeWallet = useMemo(() => {
    const _account = account?.toLowerCase();
    return tokenHolders.some((a) => a.toLowerCase() === _account);
  }, [account, tokenHolders]);

  const isValid = useMemo(() => {
    return isContractAddressFormatValid && tokenHolders.length > 0;
  }, [isContractAddressFormatValid, tokenHolders.length]);

  useEffect(() => {
    (async () => {
      if (contractAddress.length === 0) {
        setIsLoadingNftName(false);
        setNftName(null);
        setLoadedNftName(false);
        return;
      }
      if (!isContractAddressFormatValid) {
        setIsLoadingNftName(false);
        setNftName("");
        setLoadedNftName(false);
        return;
      }
      if (isLoadingNftName || loadedNftName) return;

      try {
        setIsLoadingNftName(true);
        const [baseInfo] = await Promise.all([
          fetchNftBaseInfo(contractAddress),
          fetchHolders(contractAddress),
        ]);
        if (!baseInfo || !baseInfo.name) {
          setNftName("");
          return;
        }

        setNftName(baseInfo.name);
      } catch (error) {
        console.error(error);
        setNftName("");
      } finally {
        setIsLoadingNftName(false);
        setLoadedNftName(true);
      }
    })();
  }, [
    contractAddress,
    fetchHolders,
    isContractAddressFormatValid,
    isLoadingNftName,
    isValid,
    loadedNftName,
  ]);

  useEffect(() => {
    props.onChange(contractAddress, isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, isValid]);

  return (
    <>
      <FormControl mt={4}>
        <FormLabel size="sm">NFT Contract Address</FormLabel>
        <Input
          required
          color="white"
          isInvalid={!isContractAddressFormatValid}
          placeholder="0xabcd..."
          value={contractAddress}
          onChange={(evt) => setContractAddress(evt.target.value)}
        />
      </FormControl>
      <Button
        variant="ghost"
        size="xs"
        color="gray.400"
        colorScheme="gray"
        onClick={() => setContractAddress(TEST_NFT_CONTRACT_ADDRESS)}
      >
        User Sample Address
      </Button>
      {isContractAddressFormatValid && (
        <Card bg="gray.900" p={1} mt={2}>
          <CardBody p={1}>
            <Flex align="center">
              {isLoadingNftName && <Text fontSize="sm">Loading...</Text>}
              {!isLoadingNftName && nftName && (
                <>
                  <Text fontSize="sm">
                    <CheckIcon mr={2} />
                    Project Found: {nftName}
                  </Text>
                </>
              )}
              {!isLoadingNftName && !nftName && (
                <>
                  <NotAllowedIcon mr={2} />
                  <Text fontSize="sm">Project Not Found</Text>
                </>
              )}
            </Flex>
            <Flex align="center">
              {isLoadingNftName && <Text fontSize="sm">Loading...</Text>}
              {!isLoadingNftName && tokenHolders && (
                <>
                  <Text fontSize="sm">
                    <CheckIcon mr={2} />
                    Token Holders: {tokenHolders.length}
                  </Text>
                </>
              )}
              {!isLoadingNftName && !tokenHolders && (
                <>
                  <Text ml={2} fontSize="sm">
                    <NotAllowedIcon mr={2} />
                    Token Holders Not Found
                  </Text>
                </>
              )}
            </Flex>
            <Flex align="center">
              <Text fontSize="sm">
                {isLoadingNftName && "Loading..."}
                {!isLoadingNftName && isHoldersIncludeWallet && "including you!"}
                {!isLoadingNftName && !isHoldersIncludeWallet && "you have no tokens"}
              </Text>
            </Flex>
          </CardBody>
        </Card>
      )}
    </>
  );
};

const NewFormInfoDialog = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNext: (title: string, description: string, contractAddress: string) => void;
}) => {
  // form title and contract address
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isContractAddressValid, setIsContractAddressValid] = useState(false);

  const isTitleFormatValid = useMemo(() => {
    return 0 < title.length;
  }, [title]);
  const isDescriptionFormatValid = useMemo(() => {
    return 0 < description.length;
  }, [description]);

  const isFirstStepValid = useMemo(() => {
    return isTitleFormatValid && isDescriptionFormatValid && isContractAddressValid;
  }, [isContractAddressValid, isDescriptionFormatValid, isTitleFormatValid]);

  const clickNext = () => {
    if (!isFirstStepValid) return;
    props.onNext(title, description, contractAddress);
  };

  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.700">
          <ModalHeader as="h2" fontWeight="light" color="white">
            Create New Form
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel fontSize="sm">Form Title</FormLabel>
              <Input
                required
                color="white"
                isInvalid={!isTitleFormatValid}
                placeholder="My best form ever"
                value={title}
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel fontSize="sm">Form Description</FormLabel>
              <Textarea
                required
                color="white"
                isInvalid={!isDescriptionFormatValid}
                placeholder="A survey to analyze the demography of NFT holders"
                value={description}
                onChange={(evt) => setDescription(evt.target.value)}
              />
            </FormControl>
            <Box mt={4}>
              <NftFormControl
                value={contractAddress}
                onChange={(val, isValid) => {
                  console.log(val);
                  console.log(isValid);
                  setContractAddress(val);
                  setIsContractAddressValid(isValid);
                }}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%" mt={4}>
              <GridItem colSpan={{ base: 3 }}>
                <Button size="sm" w="100%" variant="ghost" onClick={props.onClose}>
                  Cancel
                </Button>
              </GridItem>
              <GridItem colSpan={{ base: 9 }}>
                <Button
                  size="sm"
                  w="100%"
                  onClick={clickNext}
                  colorScheme="pink"
                  disabled={!isFirstStepValid}
                >
                  Next
                </Button>
              </GridItem>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewFormInfoDialog;
