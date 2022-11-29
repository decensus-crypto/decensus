import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
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
import { useEthers } from "../../hooks/useEthers";
import { useLitCeramic } from "../../hooks/useLitCeramic";
import { useWallet } from "../../hooks/useWallet";
import { Answer, Question, QuestionnaireForm } from "../../types";
import Logo from "../logo";
import SelectRating from "../SelectRating";

type AnswerInForm = Omit<Answer, "questionId">;

const SingleChoiseAnswerField = (props: {
  initialValue: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <RadioGroup value={value} onChange={(value) => setValue(value)}>
      <VStack align="left">
        {props.options.map((option, i) => (
          <Radio size="lg" key={i} value={option}>
            <Text color="white"> {option}</Text>
          </Radio>
        ))}
      </VStack>
    </RadioGroup>
  );
};

const SingleChoiseDropdownAnswerField = (props: {
  initialValue: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <Select
      value={value}
      color="white"
      onChange={(evt) => setValue(evt.target.value)}
      placeholder="Please select"
    >
      {props.options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
};
const MultiChoiseDropdownAnswerField = (props: {
  initialValue: string[];
  options: string[];
  onChange: (value: string[]) => void;
}) => {
  const [values, setValues] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(values);
  }, [values]);

  return (
    <CheckboxGroup
      value={values}
      onChange={(values) => setValues(values.map((v) => v.toString()))}
    >
      <VStack align="left">
        {props.options.map((option, i) => (
          <Checkbox size="lg" key={i} value={option}>
            <Text color="white">{option}</Text>
          </Checkbox>
        ))}
      </VStack>
    </CheckboxGroup>
  );
};

const RatingAnswerField = (props: {
  initialValue: number;
  ratingMax: number;
  onChange: (value: number) => void;
}) => {
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <SelectRating
      rating={value}
      ratingMax={props.ratingMax}
      onChange={(value) => setValue(value)}
    />
  );
};

const TextAnswerField = (props: {
  initialValue: string;
  onChange: (value: string) => void;
}) => {
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <Textarea
      color="white"
      required
      size="lg"
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
    />
  );
};

const DateAnswerField = (props: {
  initialValue: string;
  onChange: (value: string) => void;
}) => {
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <Input
      type="date"
      color="white"
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
    />
  );
};

const AnswerFormBody = (props: {
  index: number;
  question: Question;
  answer?: AnswerInForm;
  setAnswer: (answer: AnswerInForm) => void;
  clickNext: () => void;
}) => {
  const currentSingleAnswer =
    typeof props.answer?.answer === "object" ? "" : props.answer?.answer || "";
  const currentMultiAnswer =
    typeof props.answer?.answer === "object" ? props.answer?.answer : [] || [];

  return (
    <Card
      bg="gray.800"
      w="100%"
      maxW="4xl"
      h="100%"
      overflowY="scroll"
      pt={{ base: 4, sm: 8, md: 16 }}
      px={{ base: 4, sm: 8, md: 16 }}
    >
      <Flex>
        <Text fontSize="2xl" px={4} w={16} color="white">
          {props.index + 1}
        </Text>
        <Box flex="1">
          <Text fontSize="2xl" color="white">
            {props.question.questionBody}
          </Text>
          <Box mt={2}>
            {props.question.questionType === "single_choice" && (
              <SingleChoiseAnswerField
                initialValue={currentSingleAnswer as string}
                options={props.question.options}
                onChange={(value) => {
                  console.log(value);
                  props.setAnswer({
                    questionType: props.question.questionType,
                    answer: value,
                  });
                }}
              />
            )}
            {props.question.questionType === "single_choice_dropdown" && (
              <SingleChoiseDropdownAnswerField
                initialValue={currentSingleAnswer as string}
                options={props.question.options}
                onChange={(value) => {
                  console.log(value);
                  props.setAnswer({
                    questionType: props.question.questionType,
                    answer: value,
                  });
                }}
              />
            )}
            {props.question.questionType === "multi_choice" && (
              <MultiChoiseDropdownAnswerField
                initialValue={currentMultiAnswer as string[]}
                options={props.question.options}
                onChange={(value) => {
                  console.log(value);
                  props.setAnswer({
                    questionType: props.question.questionType,
                    answer: value,
                  });
                }}
              />
            )}
            {props.question.questionType === "rating" && (
              <RatingAnswerField
                initialValue={Number.parseInt(currentSingleAnswer)}
                ratingMax={props.question.ratingMax}
                onChange={(value) => {
                  props.setAnswer({
                    questionType: props.question.questionType,
                    answer: value.toString(),
                  });
                }}
              />
            )}
            {props.question.questionType === "date" && (
              <DateAnswerField
                initialValue={currentSingleAnswer as string}
                onChange={(value) => {
                  console.log(value);
                  props.setAnswer({
                    questionType: props.question.questionType,
                    answer: value,
                  });
                }}
              />
            )}
            {props.question.questionType === "text" && (
              <TextAnswerField
                initialValue={currentSingleAnswer as string}
                onChange={(value) => {
                  console.log(value);
                  props.setAnswer({
                    questionType: props.question.questionType,
                    answer: value,
                  });
                }}
              />
            )}
          </Box>
        </Box>
      </Flex>
      <Flex align="center" justify="center" h="100%">
        <Button size="lg" w={240} mt={8} mb={2} onClick={props.clickNext}>
          Next
        </Button>
      </Flex>
    </Card>
  );
};

export default function AnswerFormDialog(props: {
  formCollectionAddress: string;
  questionnaireForm: QuestionnaireForm | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, { questionType: string; answer: string | string[] }>
  >({});

  const {
    isOpen: isOpenSubmit,
    onOpen: onOpenSubmit,
    onClose: onCloseSubmit,
  } = useDisclosure();
  const { submitAnswerStatus, submitAnswerErrorMessage, submitAnswers } =
    useLitCeramic();
  const { wallet, provider, didProvider, getDidProvider } = useWallet();
  const {
    fetchQuestionnaireCollectionContract,
    questionnaireCollectionContract,
  } = useEthers();

  useEffect(() => {
    if (!props.isOpen) return;
    if (questionnaireCollectionContract) return;
    if (!wallet) return;
    if (!provider) return;
    fetchQuestionnaireCollectionContract(
      props.formCollectionAddress,
      wallet,
      provider
    );
  }, [
    props.formCollectionAddress,
    props.isOpen,
    wallet,
    provider,
    questionnaireCollectionContract,
    fetchQuestionnaireCollectionContract,
  ]);

  const questionnaireTitle = useMemo(() => {
    if (!props.questionnaireForm) return;
    if (!props.questionnaireForm.questionnaire) return;
    return props.questionnaireForm.questionnaire.title;
  }, [props.questionnaireForm]);

  const questions = useMemo((): Question[] => {
    if (!props.questionnaireForm) return [];
    if (!props.questionnaireForm.questionnaire) return [];
    if (!props.questionnaireForm.questionnaire.questions) return [];

    return props.questionnaireForm.questionnaire.questions;
  }, [props.questionnaireForm]);

  const prevSlidable = useMemo(() => {
    return 0 < slideIndex;
  }, [slideIndex]);
  const nextSlidable = useMemo(() => {
    return slideIndex < questions.length;
  }, [slideIndex]);

  const submittable = useMemo(() => {
    if (!wallet) return false;
    if (!questionnaireCollectionContract) return false;

    return (
      Object.keys(answers).length === questions.length &&
      Object.values(answers).every((a) => a.answer && a.answer.length > 0)
    );
  }, [answers]);

  const clickPrev = () => {
    if (!prevSlidable) return;
    setSlideIndex(slideIndex - 1);
  };
  const clickNext = () => {
    if (!nextSlidable) return;
    setSlideIndex(slideIndex + 1);
  };

  const clickSubmit = async () => {
    if (!submittable) return;
    if (!questionnaireCollectionContract) return;
    if (!wallet) return;

    const answerArr = Object.entries(answers).map(([questionId, params]) => ({
      questionId,
      ...params,
    }));
    onOpenSubmit();
    submitAnswers(
      wallet,
      questionnaireCollectionContract,
      props.questionnaireForm?.answerableWallets || [],
      answerArr
    );
  };

  return (
    <>
      <Modal size="full" isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box
            h={{ base: "128px", md: "64px" }}
            w="100%"
            overflowY="hidden"
            bg="black"
          >
            <Grid templateColumns="repeat(12, 1fr)" gap={0} w="100%">
              <GridItem colSpan={{ base: 12, md: 3 }} h="64px">
                <Flex align="center" justify="center" h="100%">
                  <Logo height={12} />
                </Flex>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }} h="64px">
                <Flex align="center" justify="center" h="100%">
                  <Heading as="h2" size="md" color="white">
                    {questionnaireTitle}
                  </Heading>
                </Flex>
              </GridItem>
            </Grid>
          </Box>
          <Box h="1px" w="100%" bg="gray.700" />
          <Box w="100%" bg="black">
            <Box h="64px" w="100%">
              <Flex align="center" justify="center" w="100%">
                <Box w="100%" maxW="4xl">
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
              </Flex>
            </Box>
            <Box h="calc(100vh - 64px - 1px - 64px)" w="100%" bg="black">
              <Carousel
                slidesToShow={1}
                withoutControls={true}
                dragging={false}
                slideIndex={slideIndex}
              >
                {questions.map((question, idx) => {
                  return (
                    <Flex
                      align="center"
                      justify="center"
                      h="100%"
                      key={`question_${idx}`}
                      pt={2}
                      px={{ base: 4, sm: 8, md: 16 }}
                    >
                      <AnswerFormBody
                        index={idx}
                        question={question}
                        setAnswer={(a) =>
                          setAnswers({ ...answers, [question.id]: a })
                        }
                        clickNext={clickNext}
                      />
                    </Flex>
                  );
                })}
                <Flex align="center" justify="center" h="100%">
                  <Box>
                    <Button
                      size="lg"
                      colorScheme="pink"
                      disabled={!submittable}
                      onClick={clickSubmit}
                    >
                      Finish &amp; Submit
                    </Button>
                  </Box>
                </Flex>
              </Carousel>
            </Box>
          </Box>
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={isOpenSubmit} onClose={onCloseSubmit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="h2" fontWeight="light" color="gray">
            Submitting answers...
          </ModalHeader>
          <ModalBody>
            {submitAnswerStatus === "pending" && <Text>Nothing Happening</Text>}
            {submitAnswerStatus === "encrypting" && (
              <Text>Encrypting the answers...</Text>
            )}
            {submitAnswerStatus === "writing" && <Text>Uploading...</Text>}
            {submitAnswerStatus === "completed" && (
              <Text>Answer successfully submitted!</Text>
            )}
            {submitAnswerStatus === "failed" && (
              <Text>
                Failed :(
                <br />
                {submitAnswerErrorMessage}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%" mt={4}>
              {submitAnswerStatus === "completed" && (
                <GridItem colSpan={{ base: 12 }}>
                  <Link href="/">
                    <Button size="sm" w="100%">
                      Finish
                    </Button>
                  </Link>
                </GridItem>
              )}{" "}
              {submitAnswerStatus === "failed" && (
                <GridItem colSpan={{ base: 12 }}>
                  <Button
                    size="sm"
                    w="100%"
                    onClick={() => {
                      onCloseSubmit();
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
