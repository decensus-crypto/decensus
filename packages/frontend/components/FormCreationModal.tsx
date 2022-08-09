import FormDeployButoton from "../components/FormDeployButton";

import { CheckIcon, CopyIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
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
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  QuestionId,
  QUESTIONS,
  TEST_NFT_CONTRACT_ADDRESS,
} from "../constants/constants";
import { createToast } from "../utils/createToast";
import { fetchNftBaseInfo } from "../utils/zdk";

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

const FormCreationModal = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  // form title and contract address
  const [title, setTitle] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [isLoadingNftName, setIsLoadingNftName] = useState(false);
  const [loadedNftName, setLoadedNftName] = useState(false);
  const [nftName, setNftName] = useState<string | null>(null);

  // question IDs to include in form
  const [questionIds, setQuestionIds] = useState<QuestionId[]>([]);

  // after form creation
  const [formStep, setFormStep] = useState<
    "start" | "select_questions" | "form_created"
  >("start");
  const [formUrl, setFormUrl] = useState<string>("");
  const copyFormUrl = useClipboard(formUrl);

  const isContractAddressFormatValid =
    contractAddress.startsWith("0x") && contractAddress.length === 42;

  const isFirstStepValid = title.length > 0 && isContractAddressFormatValid;
  const isSecondStepValid = questionIds.length > 0;

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
  }, [
    contractAddress,
    isContractAddressFormatValid,
    isLoadingNftName,
    loadedNftName,
    nftName,
  ]);

  const onDeployComplete = (params: { formUrl: string } | null) => {
    setFormStep("form_created");
    if (!params) return;
    setFormUrl(params.formUrl);
  };

  const onClickFormUrlCopy = () => {
    copyFormUrl.onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent color="white" background="gray.700">
        <ModalHeader>Create new form with our template</ModalHeader>
        <ModalCloseButton />

        {formStep === "start" && (
          <>
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
                <FormLabel display="flex" justifyContent="stretch" mr="0">
                  NFT Contract Address
                  <Spacer />
                  <Button
                    size="xs"
                    onClick={() =>
                      setContractAddress(TEST_NFT_CONTRACT_ADDRESS)
                    }
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
                <NftName
                  nftName={nftName}
                  isLoadingNftName={isLoadingNftName}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Flex>
                <Button size="md" variant="outline" onClick={props.onClose}>
                  Cancel
                </Button>
                <Button
                  ml={4}
                  size="md"
                  variant="outline"
                  color="#FC8CC9"
                  onClick={() => setFormStep("select_questions")}
                  disabled={!isFirstStepValid}
                >
                  Next
                </Button>
              </Flex>
            </ModalFooter>
          </>
        )}

        {formStep === "select_questions" && (
          <>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>What do you want to ask in your form?</FormLabel>
                <Stack mt={2}>
                  {QUESTIONS.map((q) => (
                    <Checkbox
                      isChecked={questionIds.includes(q.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setQuestionIds([...questionIds, q.id]);
                        } else {
                          setQuestionIds(questionIds.filter((i) => i !== q.id));
                        }
                      }}
                      size="lg"
                      key={q.id}
                    >
                      <Box color="white">{q.question_title || ""}</Box>
                    </Checkbox>
                  ))}
                </Stack>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Flex>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => setFormStep("start")}
                >
                  Back
                </Button>
                <FormDeployButoton
                  canDeploy={isFirstStepValid && isSecondStepValid}
                  nftAddress={contractAddress}
                  title={title}
                  questionIds={questionIds}
                  onDeployComplete={onDeployComplete}
                />
              </Flex>
            </ModalFooter>
          </>
        )}

        {formStep === "form_created" && (
          <>
            <ModalBody pb={6}>
              <Heading size="md" mt={6} mb={2}>
                Form &quot;{title}&quot; has been created! 🎉
              </Heading>
              <Text>Let&lsquo;s share the form to your community members</Text>

              <Button
                mt={6}
                variant="outline"
                color="#FC8CC9"
                onClick={onClickFormUrlCopy}
              >
                <CopyIcon mr={1} />
                Copy form URL
              </Button>
            </ModalBody>
            <ModalFooter>
              <Flex>
                <Button size="md" variant="outline" onClick={props.onClose}>
                  Close
                </Button>
              </Flex>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FormCreationModal;
