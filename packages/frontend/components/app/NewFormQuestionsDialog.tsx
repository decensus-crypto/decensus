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
  Divider,
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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Text,
  Textarea,
  Tooltip,
  useBreakpointValue,
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
// @ts-expect-error
import { v4 as uuidv4 } from "uuid";
import { PREDEFINED_QUESTIONS } from "../../constants/constants";
import { useEthers } from "../../hooks/useEthers";
import { useLitCeramic } from "../../hooks/useLitCeramic";
import { useReservoir } from "../../hooks/useReservoir";
import { useWallet } from "../../hooks/useWallet";
import { Question } from "../../types";
import Logo from "../logo";
import SelectRating from "../SelectRating";

const NewFormQuestionsBodyMobile = (props: {}) => {
  return (
    <>
      <ModalHeader as="h2" fontWeight="light" color="gray">
        Create New Form
      </ModalHeader>
      <ModalCloseButton />
      <Divider color="gray.300" />
      <ModalBody></ModalBody>
    </>
  );
};

const QuestionForm = (props: {
  idx: number;
  question: Question;
  onChanged: (question: Question, idx: number) => void;
}) => {
  const [questionType, setQuestionType] = useState(props.question.questionType);
  const [questionBody, setQuestionBody] = useState(props.question.questionBody);
  const [ratingMax, setRatingMax] = useState(props.question.ratingMax);
  const [options, setOptions] = useState(props.question.options);
  useEffect(() => {
    setQuestionType(props.question.questionType);
    setQuestionBody(props.question.questionBody);
    setOptions(props.question.options);
  }, [props.question]);

  useEffect(() => {
    (async () => {
      const record: Question = {
        id: props.question.id,
        questionType: questionType,
        questionBody: questionBody,
        ratingMax: ratingMax,
        options: options,
      };
      props.onChanged(record, props.idx);
    })();
  }, [questionType, questionBody, options]);

  const setOptionText = (val: string, idx: number) => {
    setOptions((options) => {
      const records = [...options];
      records[idx] = val;
      return records;
    });
  };
  const addOption = () => {
    setOptions((options) => {
      return [...options, ""];
    });
  };
  const removeOption = (idx: number) => {
    setOptions((options) => {
      return options.filter((_, iidx) => idx !== iidx);
    });
  };
  return (
    <Flex>
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
            value={questionBody}
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
            value={questionType}
            onChange={(evt) =>
              setQuestionType(
                evt.target.value as
                  | "single_choice"
                  | "single_choice_dropdown"
                  | "multi_choice"
                  | "rating"
                  | "text"
                  | "date"
              )
            }
          >
            <option value="single_choice">Choice</option>
            <option value="single_choice_dropdown">Dropdown</option>
            <option value="multi_choice">Checkbox</option>
            <option value="rating">Rating</option>
            <option value="text">Text</option>
            <option value="date">Date</option>
          </Select>
        </FormControl>
        {["single_choice", "single_choice_dropdown", "multi_choice"].some(
          (opt) => opt === questionType
        ) && (
          <FormControl mt={4}>
            <FormLabel color="white">Choices</FormLabel>
            <VStack align="start">
              {options.flatMap((option, iidx) => {
                return (
                  <Flex align="center">
                    <Input
                      flex={1}
                      required
                      color="white"
                      w={240}
                      value={option}
                      onChange={(evt) => setOptionText(evt.target.value, iidx)}
                    />
                    <IconButton
                      variant="ghost"
                      ml={2}
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
        {questionType == "rating" && (
          <FormControl mt={4}>
            <FormLabel color="white">Choices</FormLabel>
            <Select
              w={240}
              color="white"
              required
              size="sm"
              value={ratingMax}
              onChange={(evt) =>
                setRatingMax(Number.parseInt(evt.target.value))
              }
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </Select>
            <Box mt={2}>
              <SelectRating ratingMax={ratingMax} />
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
  onQuestionChanged: (question: Question, idx: number) => void;
  onQuestionSelected: (idx: number) => void;
  onDuplicateQuestionClicked: (idx: number) => void;
  onRemoveQuestionClicked: (idx: number) => void;
}) => {
  return (
    <Flex
      py="4px"
      px="2px"
      w="320px"
      bg={props.isActive ? "gray.800" : "inherit"}
    >
      <Center>
        <Box w="32px" h="32px">
          <Text
            fontSize="md"
            textAlign="center"
            color="white"
            mt="4px"
            mr="4px"
          >
            {props.idx + 1}
          </Text>
        </Box>
        <Text fontSize="sm" w="192px" color="white" textOverflow="clip" px={1}>
          {props.question.questionBody}
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

const NewFormQuestionsBodyDesktop = (props: {
  title: string;
  description: string;
  nftAddress: string;
  questions: Question[];
  isReadyToDeploy: boolean;
  onQuestionChanged: (question: Question, idx: number) => void;
  onQuestionReordered: (ids: string[]) => void;
  onAddQuestionClicked: () => void;
  onDuplicateQuestionClicked: (idx: number) => void;
  onRemoveQuestionClicked: (idx: number) => void;
  onSubmitClicked: () => void;
  onClose: () => void;
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) return;

    const reorderedQuestions = Array.from(props.questions);
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    props.onQuestionReordered(reorderedQuestions.map((item) => item.id));
    return result;
  };
  const prevSlidable = useMemo(() => {
    return 0 < activeQuestionIdx;
  }, [activeQuestionIdx]);
  const nextSlidable = useMemo(() => {
    return activeQuestionIdx < props.questions.length - 1;
  }, [activeQuestionIdx, props.questions]);

  const clickPrev = () => {
    if (!prevSlidable) return;
    setActiveQuestionIdx(activeQuestionIdx - 1);
  };
  const clickNext = () => {
    if (!nextSlidable) return;
    setActiveQuestionIdx(activeQuestionIdx + 1);
  };

  return (
    <>
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
                {props.nftAddress}
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
              onClick={props.onSubmitClicked}
              disabled={!props.isReadyToDeploy}
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
                      {props.questions.map((question, idx) => (
                        <Draggable
                          key={question.id}
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
                                onQuestionChanged={props.onQuestionChanged}
                                onQuestionSelected={(idx) =>
                                  setActiveQuestionIdx(idx)
                                }
                                onDuplicateQuestionClicked={
                                  props.onDuplicateQuestionClicked
                                }
                                onRemoveQuestionClicked={
                                  props.onRemoveQuestionClicked
                                }
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
                onClick={props.onAddQuestionClicked}
              >
                Add Question
              </Button>
            </Box>
          </Box>
          <Box h="calc(100vh - 64px - 1px)" w="1px" bg="gray.700"></Box>
          <Box
            h="calc(100vh - 64px - 1px)"
            w="calc(100vw - 280px - 1px)"
            overflowY="scroll"
          >
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
                {props.questions.map((question, idx) => {
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
                        onChanged={props.onQuestionChanged}
                      />
                    </Card>
                  );
                })}
              </Carousel>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default function NewFormQuestionsDialog(props: {
  title: string;
  description: string;
  nftAddress: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onQuestionnaireCreated: (formUrl: string) => void;
}) {
  const {
    isOpen: isOpenDeploy,
    onOpen: onOpenDeploy,
    onClose: onCloseDeploy,
  } = useDisclosure();
  const { wallet, provider, didProvider, getDidProvider } = useWallet();
  const {
    fetchQuestionnaireCollectionFactoryContract,
    questionnaireCollectionFactoryContract,
  } = useEthers();
  const {
    litClient,
    ceramicClient,
    formUrl,
    deployStatus,
    deployErrorMessage,
    initLit,
    initCeramic,
    deployQuestionnaireForm,
  } = useLitCeramic();
  const { holders, fetchHolders } = useReservoir();

  useEffect(() => {
    if (!props.isOpen) return;
    if (questionnaireCollectionFactoryContract) return;
    if (!wallet) return;
    if (!provider) return;
    fetchQuestionnaireCollectionFactoryContract(wallet, provider);
  }, [
    props.isOpen,
    wallet,
    provider,
    questionnaireCollectionFactoryContract,
    fetchQuestionnaireCollectionFactoryContract,
  ]);

  useEffect(() => {
    if (!props.isOpen) return;
    if (!wallet) return;
    if (!provider) return;
    if (didProvider) return;
    getDidProvider();
  }, [props.isOpen, wallet, provider, didProvider, getDidProvider]);

  useEffect(() => {
    if (!props.isOpen) return;
    if (props.nftAddress.length !== 42) return;
    fetchHolders(props.nftAddress);
  }, [props.isOpen, props.nftAddress, fetchHolders]);

  useEffect(() => {
    if (!props.isOpen) return;
    initLit();
  }, [props.isOpen, initLit]);

  useEffect(() => {
    if (!didProvider) return;
    initCeramic(didProvider);
  }, [didProvider, initCeramic]);

  useEffect(() => {
    if (deployStatus !== "completed") return;
    if (!formUrl) return;
    props.onClose();
    props.onQuestionnaireCreated(formUrl);
  }, [deployStatus]);

  const isReadyToDeploy = useMemo(() => {
    return (
      wallet &&
      holders &&
      litClient &&
      ceramicClient &&
      questionnaireCollectionFactoryContract
    );
  }, [
    wallet,
    litClient,
    holders,
    ceramicClient,
    questionnaireCollectionFactoryContract,
  ]);

  const [questions, setQuestions] = useState<Question[]>(
    PREDEFINED_QUESTIONS.flatMap((question) => {
      return {
        id: uuidv4(),
        questionType: question.questionType,
        questionBody: question.questionBody,
        ratingMax: question.ratingMax,
        options: [...question.options],
      };
    })
  );
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const onQuestionChanged = (question: Question, idx: number) => {
    const records = [...questions];
    records[idx].questionType = question.questionType;
    records[idx].questionBody = question.questionBody;
    records[idx].options = [...question.options];

    setQuestions(records);
  };

  const onQuestionReordered = (ids: string[]) => {
    const records: Question[] = [];
    ids.forEach((id) => {
      const question = questions.find((question) => question.id === id);
      if (question) {
        records.push(question);
      }
    });
    setQuestions(records);
  };

  const clickAddQuestion = () => {
    setQuestions((questions) => {
      const records = [...questions];
      records.push({
        id: uuidv4(),
        questionType: "single_choice",
        questionBody: "",
        ratingMax: 5,
        options: [],
      });
      return records;
    });
  };

  const clickDuplicateQuestion = (idx: number) => {
    const currentQuestion = questions[idx];
    setQuestions((questions) => {
      const records = [...questions];
      records.push({
        id: uuidv4(),
        questionType: currentQuestion.questionType,
        questionBody: currentQuestion.questionBody,
        ratingMax: currentQuestion.ratingMax,
        options: currentQuestion.options,
      });
      return records;
    });
  };

  const clickRemoveQuestion = (idx: number) => {
    setQuestions((questions) => {
      return [...questions].filter((_, iidx) => idx !== iidx);
    });
  };

  const clickSubmit = () => {
    if (!isReadyToDeploy) return;
    if (!["pending", "failed"].some((st) => st === deployStatus)) return;
    if (!wallet) return;
    if (!questionnaireCollectionFactoryContract) return;

    const questionnaireForm = {
      questionnaire: {
        title: props.title,
        description: props.description,
        questions: questions,
      },
      nftAddress: props.nftAddress,
      answerableWallets: holders,
    };
    onOpenDeploy();
    deployQuestionnaireForm(
      wallet,
      questionnaireCollectionFactoryContract,
      questionnaireForm
    );
  };
  return (
    <>
      <Modal size="full" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          {isMobile ? (
            <NewFormQuestionsBodyMobile />
          ) : (
            <NewFormQuestionsBodyDesktop
              title={props.title}
              description={props.description}
              nftAddress={props.nftAddress}
              questions={questions}
              isReadyToDeploy={isReadyToDeploy}
              onQuestionChanged={onQuestionChanged}
              onQuestionReordered={onQuestionReordered}
              onAddQuestionClicked={clickAddQuestion}
              onDuplicateQuestionClicked={(idx) => clickDuplicateQuestion(idx)}
              onRemoveQuestionClicked={(idx) => clickRemoveQuestion(idx)}
              onSubmitClicked={clickSubmit}
              onClose={props.onClose}
            />
          )}
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={isOpenDeploy} onClose={onCloseDeploy}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="h2" fontWeight="light" color="gray">
            Publish {props.title} in progress...
          </ModalHeader>
          <ModalBody>
            {deployStatus === "pending" && <Text>Nothing Happening</Text>}
            {deployStatus === "encrypting" && (
              <Text>Encrypting the form contents...</Text>
            )}
            {deployStatus === "writing" && <Text>Decentralizing...</Text>}
            {deployStatus === "failed" && (
              <Text>
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
                  <Button
                    size="sm"
                    w="100%"
                    onClick={() => {
                      onCloseDeploy();
                    }}
                  >
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
}
