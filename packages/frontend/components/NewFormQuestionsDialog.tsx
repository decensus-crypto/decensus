import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Carousel from "nuka-carousel/lib/carousel";
import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { PRESET_QUESTIONS } from "../constants/constants";
import { useCeramic } from "../hooks/litCeramic/useCeramic";
import { useLit } from "../hooks/litCeramic/useLit";
import { useDeploy } from "../hooks/useDeploy";
import { useFormList } from "../hooks/useFormList";
import { useTokenHolders } from "../hooks/useTokenHolders";
import { Question, QuestionType } from "../types";
import { genQuestionId } from "../utils/questionId";
import { fetchNftBaseInfo } from "../utils/zdk";
import Logo from "./logo";
import SelectRating from "./SelectRating";

const QuestionForm = (props: {
  idx: number;
  question: Question;
  onChanged: (question: Question) => void;
}) => {
  const setQuestionBody = (value: string) => {
    (async () => {
      props.onChanged({
        ...props.question,
        question_body: value,
      });
    })();
  };

  const setQuestionType = (value: QuestionType) => {
    (async () => {
      props.onChanged({
        ...props.question,
        question_type: value,
      });
    })();
  };

  const setOptionText = (val: string, idx: number) => {
    (async () => {
      const options = [...props.question.options];
      options[idx].text = val;
      props.onChanged({
        ...props.question,
        options: options,
      });
    })();
  };

  const addOption = () => {
    (async () => {
      const options = [
        ...props.question.options,
        { index: props.question.options.length, text: "" },
      ];
      props.onChanged({
        ...props.question,
        options: options,
      });
    })();
  };

  const removeOption = (idx: number) => {
    (async () => {
      const options = props.question.options.filter((_, iidx) => idx !== iidx);
      props.onChanged({
        ...props.question,
        options: options,
      });
    })();
  };
  return (
    <Flex key={`question_form_${props.question.id}`}>
      <Text fontSize="2xl" px={4} w={16} color="white">
        {props.idx + 1}
      </Text>
      <Box flex="1">
        <FormControl>
          <Textarea
            color="white"
            required
            size="lg"
            placeholder="What's your age range?"
            value={props.question.question_body}
            onChange={(evt) => setQuestionBody(evt.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel color="white">Answer Type</FormLabel>
          <Select
            w={240}
            color="white"
            required
            size="sm"
            value={props.question.question_type}
            onChange={(evt) => setQuestionType(evt.target.value as QuestionType)}
          >
            <option value="single_choice">Choice</option>
            <option value="single_choice_dropdown">Dropdown</option>
            <option value="multi_choice">Checkbox</option>
            <option value="text">Text</option>
            <option value="date">Date Picker</option>
            <option value="rating">Rating</option>
          </Select>
        </FormControl>
        {["single_choice", "single_choice_dropdown", "multi_choice"].some(
          (opt) => opt === props.question.question_type,
        ) && (
          <FormControl mt={4}>
            <FormLabel color="white">Choices</FormLabel>
            <VStack align="start">
              {props.question.options.map((option, iidx) => {
                return (
                  <Flex align="center" key={`question_form_${props.question.id}_options_${iidx}`}>
                    <Input
                      flex={1}
                      required
                      color="white"
                      w={240}
                      value={option.text}
                      onChange={(evt) => setOptionText(evt.target.value, iidx)}
                    />
                    <IconButton
                      variant="ghost"
                      size="sm"
                      ml={2}
                      color="white"
                      aria-label="Remove"
                      icon={<CloseIcon />}
                      onClick={() => removeOption(iidx)}
                    />
                  </Flex>
                );
              })}
            </VStack>
            <Button size="sm" leftIcon={<AddIcon />} mt={2} onClick={addOption}>
              Add
            </Button>
          </FormControl>
        )}
        {["rating"].some((opt) => opt === props.question.question_type) && (
          <FormControl mt={4}>
            <FormLabel color="white">Max Rating</FormLabel>
            <Select
              w={240}
              color="white"
              required
              size="sm"
              value={props.question.question_max_rating}
              onChange={(evt) =>
                props.onChanged({
                  ...props.question,
                  question_max_rating: Number.parseInt(evt.target.value),
                })
              }
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </Select>
            <Box mt={2}>
              <SelectRating ratingMax={props.question.question_max_rating} />
            </Box>
          </FormControl>
        )}
      </Box>
    </Flex>
  );
};

const QuestionRow = (props: {
  idx: number;
  question: Question;
  isActive: boolean;
  onQuestionSelected: (idx: number) => void;
  onDuplicateQuestionClicked: (idx: number) => void;
  onRemoveQuestionClicked: (idx: number) => void;
}) => {
  return (
    <Flex py="4px" px="2px" w="320px" bg={props.isActive ? "gray.800" : "inherit"}>
      <Center>
        <Box w="32px" h="32px">
          <Text fontSize="md" textAlign="center" color="white" mt="4px" mr="4px">
            {props.idx + 1}
          </Text>
        </Box>
        <Text fontSize="sm" w="192px" color="white" textOverflow="clip" px={1}>
          {props.question.question_body}
        </Text>
        <Box w="32px" h="32px">
          <Tooltip label="Duplicate">
            <IconButton
              mt="4px"
              mr="4px"
              size="xs"
              colorScheme="gray"
              aria-label="Duplicate"
              icon={<CopyIcon />}
              onClick={() => props.onDuplicateQuestionClicked(props.idx)}
            />
          </Tooltip>
        </Box>
        <Box w="32px" h="32px">
          <Tooltip label="Remeve">
            <IconButton
              size="xs"
              mt="4px"
              mr="4px"
              colorScheme="gray"
              aria-label="Remeve"
              icon={<CloseIcon />}
              onClick={() => props.onRemoveQuestionClicked(props.idx)}
            />
          </Tooltip>
        </Box>
        <Box w="32px" h="32px">
          <Tooltip label="Edit">
            <IconButton
              size="xs"
              mt="4px"
              mr="4px"
              aria-label="Edit"
              colorScheme="pink"
              icon={<EditIcon />}
              onClick={() => props.onQuestionSelected(props.idx)}
            />
          </Tooltip>
        </Box>
      </Center>
    </Flex>
  );
};

const NewFormQuestionsDialog = (props: {
  title: string;
  description: string;
  contractAddress: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreated: (formUrl: string) => void;
}) => {
  const { deploy, deployStatus, deployErrorMessage } = useDeploy();
  const { initLitClient, isLitClientReady } = useLit();
  const { initCeramic, isCeramicReady } = useCeramic();
  const { tokenHolders, fetchHolders } = useTokenHolders();
  const { fetchFormList } = useFormList();

  const deployModal = useDisclosure();

  // form title and contract address
  const [isLoadingNftName, setIsLoadingNftName] = useState(false);
  const [loadedNftName, setLoadedNftName] = useState(false);

  // question IDs to include in form
  const [questions, setQuestions] = useState<Question[]>(PRESET_QUESTIONS);
  const isSecondStepValid = questions.length > 0;
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);

  const prevSlidable = useMemo(() => {
    return 0 < activeQuestionIdx;
  }, [activeQuestionIdx]);
  const nextSlidable = useMemo(() => {
    return activeQuestionIdx < questions.length - 1;
  }, [activeQuestionIdx, questions]);

  useEffect(() => {
    initLitClient();
  }, [initLitClient]);

  useEffect(() => {
    initCeramic();
  }, [initCeramic]);

  useEffect(() => {
    (async () => {
      if (isLoadingNftName || loadedNftName) return;
      if (props.contractAddress.length === 0) return;

      try {
        setIsLoadingNftName(true);
        const [baseInfo] = await Promise.all([
          fetchNftBaseInfo(props.contractAddress),
          fetchHolders(props.contractAddress),
        ]);
        if (!baseInfo || !baseInfo.name) {
          return;
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setIsLoadingNftName(false);
        setLoadedNftName(true);
      }
    })();
  }, [fetchHolders, isLoadingNftName, loadedNftName, props.contractAddress]);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    (async () => {
      if (!result.destination) return;

      const reorderedQuestions = [...questions];
      const [removed] = reorderedQuestions.splice(result.source.index, 1);
      reorderedQuestions.splice(result.destination.index, 0, removed);
      setQuestions(reorderedQuestions);
    })();
  };

  const onQuestionChanged = (question: Question, idx: number) => {
    (async () => {
      setQuestions((questions) => {
        questions[idx] = question;
        return [...questions];
      });
    })();
  };

  const clickDuplicateQuestion = (idx: number) => {
    (async () => {
      setQuestions([...questions, { ...questions[idx] }]);
    })();
  };

  const clickRemoveQuestion = (idx: number) => {
    (async () => {
      setQuestions([...questions].filter((_, iidx) => idx !== iidx));
    })();
  };

  const clickAddQuestion = () => {
    (async () => {
      setQuestions([
        ...questions,
        {
          id: genQuestionId(),
          question_type: "single_choice",
          question_body: "",
          question_max_rating: 5,
          options: [],
        },
      ]);
    })();
  };

  const clickPrev = () => {
    if (!prevSlidable) return;
    setActiveQuestionIdx(activeQuestionIdx - 1);
  };

  const clickNext = () => {
    if (!nextSlidable) return;
    setActiveQuestionIdx(activeQuestionIdx + 1);
  };

  const onClickDeploy = () => {
    if (!(deployStatus === "pending" || deployStatus === "failed")) return;
    if (!isCeramicReady) return;
    if (!isLitClientReady) return;
    if (!isSecondStepValid) return;
    onDeploy();
  };

  const onDeploy = async () => {
    deployModal.onOpen();
    const res = await deploy({
      formParams: {
        title: props.title,
        description: props.description,
        questions: questions,
      },
      formViewerAddresses: tokenHolders,
      nftAddress: props.contractAddress,
    });
    if (!res) {
      //
      // null response means form creation faile
      //
      return;
    }
    props.onCreated(res.formUrl);
    deployModal.onClose();
    await fetchFormList({
      overrides: [
        {
          title: props.title,
          formUrl: res.formUrl,
          contractAddress: res.formCollectionAddress,
          createdAt: Date.now(),
          closed: false,
        },
      ],
    });
  };

  return (
    <>
      <Modal size="full" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box h="64px" w="100%" overflowY="hidden" bg="black">
            <Tooltip label={props.description}>
              <Box mt={3}>
                <Center>
                  <Heading as="h2" size="md" color="white">
                    {props.title}
                  </Heading>
                </Center>
                <Center>
                  <Heading as="h4" size="xs" fontWeight="light" color="white">
                    {props.contractAddress}
                  </Heading>
                </Center>
              </Box>
            </Tooltip>
            <Flex>
              <Logo height={12} position="absolute" top={2} left={3} />
              <Box height={12} position="absolute" top={4} right={3}>
                <Button
                  size="sm"
                  colorScheme="pink"
                  onClick={onClickDeploy}
                  disabled={!isLitClientReady || !isSecondStepValid}
                >
                  Publish
                </Button>
                <IconButton
                  ml={4}
                  variant="ghost"
                  size="sm"
                  aria-label="Close"
                  icon={<CloseIcon />}
                  onClick={props.onClose}
                />
              </Box>
            </Flex>
          </Box>
          <Box h="1px" w="100%" bg="gray.700" />
          <Box h="calc(100vh - 64px - 1px)" w="100%" bg="black">
            <Flex>
              <Box h="calc(100vh - 64px - 1px)" w="320px">
                <Box h="calc(100vh - 64px - 1px - 64px)" overflowY="scroll">
                  <Heading as="h3" size="sm" fontWeight="light" color="white" p={2}>
                    Questions
                  </Heading>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <Box {...provided.droppableProps} ref={provided.innerRef}>
                          {questions.map((question, idx) => (
                            <Draggable
                              key={`question_${question.id}`}
                              draggableId={"q-" + question.id}
                              index={idx}
                            >
                              {(provided, snapshot) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  bg={snapshot.isDragging ? "ping.100" : "inherit"}
                                >
                                  <QuestionRow
                                    idx={idx}
                                    question={question}
                                    isActive={idx === activeQuestionIdx}
                                    onQuestionSelected={(idx) => setActiveQuestionIdx(idx)}
                                    onDuplicateQuestionClicked={clickDuplicateQuestion}
                                    onRemoveQuestionClicked={clickRemoveQuestion}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Box>
                <Box p={4}>
                  <Button
                    leftIcon={<AddIcon />}
                    size="sm"
                    w="100%"
                    colorScheme="gray"
                    onClick={clickAddQuestion}
                  >
                    Add Question
                  </Button>
                </Box>
              </Box>
              <Box h="calc(100vh - 64px - 1px)" w="1px" bg="gray.700"></Box>
              <Box h="calc(100vh - 64px - 1px)" w="calc(100vw - 280px - 1px)" overflowY="scroll">
                <Box h="68px" w="100%">
                  <Flex>
                    <Tooltip label="Previous">
                      <IconButton
                        m={4}
                        size="md"
                        aria-label="Previous"
                        icon={<ChevronLeftIcon />}
                        disabled={!prevSlidable}
                        onClick={clickPrev}
                      />
                    </Tooltip>
                    <Spacer />
                    <Tooltip label="Next">
                      <IconButton
                        m={4}
                        size="md"
                        aria-label="Next"
                        icon={<ChevronRightIcon />}
                        disabled={!nextSlidable}
                        onClick={clickNext}
                      />
                    </Tooltip>
                  </Flex>
                </Box>
                <Box h="calc(100vh - 64px - 1px - 68px)" px={4} pb={16}>
                  <Carousel
                    slidesToShow={1}
                    withoutControls={true}
                    dragging={false}
                    slideIndex={activeQuestionIdx}
                  >
                    {questions.map((question, idx) => {
                      return (
                        <Card
                          key={`question_form_${question.id}`}
                          bg="gray.800"
                          w="100%"
                          h="100%"
                          overflowY="scroll"
                          p={16}
                        >
                          <QuestionForm
                            idx={activeQuestionIdx}
                            question={question}
                            onChanged={(question) => onQuestionChanged(question, idx)}
                          />
                        </Card>
                      );
                    })}
                  </Carousel>
                </Box>
              </Box>
            </Flex>
          </Box>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={deployModal.isOpen} onClose={deployModal.onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.700">
          <ModalHeader as="h2" fontWeight="light" color="white">
            Publish {props.title} in progress...
          </ModalHeader>
          <ModalBody>
            {deployStatus === "pending" && (
              <Text size="sm" color="white">
                Nothing Happening
              </Text>
            )}
            {deployStatus === "encrypting" && (
              <Text size="sm" color="white">
                Encrypting the form contents...
              </Text>
            )}
            {deployStatus === "uploading" && (
              <Text size="sm" color="white">
                Decentralizing...
              </Text>
            )}
            {deployStatus === "failed" && (
              <Text size="sm" color="white">
                Failed :(
                <br />
                {deployErrorMessage}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%" mt={4}>
              {deployStatus === "failed" && (
                <GridItem colSpan={{ base: 12 }}>
                  <Button size="sm" w="100%" onClick={deployModal.onClose}>
                    Close
                  </Button>
                </GridItem>
              )}
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewFormQuestionsDialog;
