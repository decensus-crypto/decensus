import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import Carousel from "nuka-carousel/lib/carousel";
import { useEffect, useMemo, useState } from "react";
import { Question, QuestionType } from "../constants/constants";
import { useCeramic } from "../hooks/litCeramic/useCeramic";
import { useLit } from "../hooks/litCeramic/useLit";
import { useAnswerSubmit } from "../hooks/useAnswerSubmit";
import Logo from "./logo";

type AnswerInForm = {
  question_type: QuestionType;
  answer: string | string[];
};

const FormInput = (props: {
  index: number;
  question: Question;
  answer: string | string[] | null;
  setAnswer: (answer: AnswerInForm) => void;
  clickNext: () => void;
}) => {
  const currentSingleAnswer =
    typeof props.answer === "object" ? "" : props.answer || "";
  const currentMultiAnswer =
    typeof props.answer === "object" ? props.answer || [] : [];

  const answerParams = {
    question_type: props.question.question_type,
  };
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
            {props.question.question_body}
          </Text>
          <Box mt={2}>
            {props.question.question_type === "single_choice" && (
              <RadioGroup
                value={currentSingleAnswer}
                onChange={(v) =>
                  props.setAnswer({ ...answerParams, answer: v })
                }
              >
                <Stack>
                  {props.question.options.map((option, i) => (
                    <Radio size="lg" key={i} value={option.text}>
                      <Box color="white">{Object.values(option)[0] || ""}</Box>
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            )}
            {props.question.question_type === "single_choice_dropdown" && (
              <Select
                value={currentSingleAnswer}
                onChange={(e) =>
                  props.setAnswer({ ...answerParams, answer: e.target.value })
                }
                placeholder="Please select"
                color="white"
                mt={8}
              >
                {props.question.options.map((option, i) => (
                  <option key={i} value={option.text}>
                    {option.text}
                  </option>
                ))}
              </Select>
            )}
            {props.question.question_type === "multi_choice" && (
              <Stack>
                {props.question.options.map((option, i) => (
                  <Checkbox
                    isChecked={currentMultiAnswer.includes(option.text)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        props.setAnswer({
                          ...answerParams,
                          answer: [...currentMultiAnswer, option.text],
                        });
                      } else {
                        props.setAnswer({
                          ...answerParams,
                          answer: currentMultiAnswer.filter(
                            (a) => a !== option.text
                          ),
                        });
                      }
                    }}
                    size="lg"
                    key={i}
                  >
                    <Box color="white">{Object.values(option)[0] || ""}</Box>
                  </Checkbox>
                ))}
              </Stack>
            )}
            {props.question.question_type === "text" && (
              <Input
                mt={8}
                placeholder="Answer Here"
                value={currentSingleAnswer}
                onChange={(e) =>
                  props.setAnswer({ ...answerParams, answer: e.target.value })
                }
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

const AnswerFormDialog = (props: {
  title: string;
  questions: Question[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { isSubmitting, submitAnswer } = useAnswerSubmit();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, { question_type: string; answer: string | string[] }>
  >({});

  const { initLitClient, getLitAuthSig } = useLit();
  const { initCeramic } = useCeramic();

  useEffect(() => {
    initLitClient();
  }, [initLitClient]);

  useEffect(() => {
    getLitAuthSig();
  }, [getLitAuthSig]);

  useEffect(() => {
    initCeramic();
  }, [initCeramic]);
  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const prevSlidable = useMemo(() => {
    return 0 < currentQuestionIndex;
  }, [currentQuestionIndex]);
  const nextSlidable = useMemo(() => {
    return currentQuestionIndex < props.questions.length;
  }, [currentQuestionIndex, props.questions.length]);
  const canSubmit =
    Object.keys(answers).length === props.questions.length &&
    Object.values(answers).every((a) => a.answer && a.answer.length > 0);

  const clickPrev = () => {
    if (!prevSlidable) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  const clickNext = () => {
    if (!nextSlidable) return;
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const clickSubmit = () => {
    if (!canSubmit) return;
    onSubmit();
  };
  const onSubmit = async () => {
    const answerArr = Object.entries(answers).map(([question_id, params]) => ({
      question_id,
      ...params,
    }));
    await submitAnswer({
      submissionStrToEncrypt: JSON.stringify({ answers: answerArr }),
    });
  };

  return (
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
                  {props.title}
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
              slideIndex={currentQuestionIndex}
            >
              {props.questions.map((question, idx) => {
                return (
                  <>
                    <Flex
                      align="center"
                      justify="center"
                      h="100%"
                      key={`question_${idx}`}
                      pt={2}
                      px={{ base: 4, sm: 8, md: 16 }}
                    >
                      <FormInput
                        index={idx}
                        question={question}
                        answer={
                          answers[question.id] && answers[question.id].answer
                        }
                        setAnswer={(a) =>
                          setAnswers({ ...answers, [question.id]: a })
                        }
                        clickNext={clickNext}
                      />
                    </Flex>
                  </>
                );
              })}
              <Flex align="center" justify="center" h="100%">
                <Box>
                  <Button
                    size="lg"
                    colorScheme="pink"
                    isLoading={isSubmitting}
                    disabled={!canSubmit}
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
  );
};

export default AnswerFormDialog;
