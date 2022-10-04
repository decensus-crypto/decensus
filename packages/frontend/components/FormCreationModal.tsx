import {
  CheckIcon,
  InfoIcon,
  WarningTwoIcon
} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner, Text,
  Textarea
} from "@chakra-ui/react";
import Router from 'next/router';
import { useEffect, useState } from "react";
import { TEST_NFT_CONTRACT_ADDRESS } from "../constants/constants";
import { useAccount } from "../hooks/useAccount";
import { useTokenHolders } from "../hooks/useTokenHolders";
import { fetchNftBaseInfo } from "../utils/zdk";

const NftInfo = (props: {
  account: string | null;
  nftName: string | null;
  tokenHolders: string[];
  isLoadingNftName: boolean;
  isLoadingTokenHolders: boolean;
}) => {
  if (props.isLoadingNftName || props.isLoadingTokenHolders) {
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
    const isOwnerIncluded = props.tokenHolders.some((a) => a === props.account);
    const shouldWarn = props.tokenHolders.length === 0 || !isOwnerIncluded;

    return (
      <>
        <Text display="flex" alignItems="center">
          <CheckIcon mr={1} fontWeight="100" color="green.500" />
          Project found: {props.nftName}
        </Text>
        <Text display="flex" alignItems="center">
          {shouldWarn ? (
            <WarningTwoIcon mr={1} />
          ) : (
            <InfoIcon mr={1} fontWeight="100" color="gray.500" />
          )}
          Total token holders: {props.tokenHolders.length} (
          {isOwnerIncluded ? "including you!" : "you have no tokens"})
        </Text>
      </>
    );
  }
};

const FormCreationModal = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { account } = useAccount();
  const { tokenHolders, isLoadingTokenHolders, fetchHolders } =
    useTokenHolders();

  // form title and contract address
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isLoadingNftName, setIsLoadingNftName] = useState(false);
  const [loadedNftName, setLoadedNftName] = useState(false);
  const [nftName, setNftName] = useState<string | null>(null);

  // after form creation
  const isContractAddressFormatValid =
    contractAddress.startsWith("0x") && contractAddress.length === 42;

  const isFirstStepValid =
    title.length > 0 &&
    isContractAddressFormatValid &&
    tokenHolders.length > 0 &&
    !isLoadingNftName &&
    !isLoadingTokenHolders;

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
      } catch (error: any) {
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
    loadedNftName,
    nftName,
  ]);

  const questionsFrm = () => {
    Router.push({
      pathname: '/app/forms/new',
      query: { title: title, description: description, nftaddress: contractAddress },
    })
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new form with our template</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Form Title</FormLabel>
            <Input
              required
              placeholder="My best form ever"
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Form Description</FormLabel>
            <Textarea
              required
              placeholder="A survey to analyze the demography of NFT holders"
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel display="flex" justifyContent="stretch" mr="0">
              NFT Contract Address
              <Spacer />
              <Button
                size="xs"
                onClick={() =>
                  setContractAddress(TEST_NFT_CONTRACT_ADDRESS)
                }
                color="gray.500"
              >
                Input sample address
              </Button>
            </FormLabel>
            <Input
              required
              placeholder="0xabcd..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              mb={1}
            />
            <NftInfo
              account={account}
              nftName={nftName}
              tokenHolders={tokenHolders}
              isLoadingNftName={isLoadingNftName}
              isLoadingTokenHolders={isLoadingTokenHolders}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex>
            <Button size="md" onClick={props.onClose} color='grey' borderColor='grey'>
              Cancel
            </Button>
            <Button
              color='brand' borderColor='brand'
              ml={4}
              size="md"
              onClick={() => questionsFrm()}
              disabled={!isFirstStepValid} >
              Next
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormCreationModal;
