import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon, HamburgerIcon
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input, Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Textarea,
  useClipboard,
  VStack
} from "@chakra-ui/react";
import { useRouter } from 'next/router';
import Carousel from "nuka-carousel";
import { useEffect, useState } from "react";
import { Question, QUESTIONS } from "../../../constants/constants";
import { useCeramic } from "../../../hooks/litCeramic/useCeramic";
import { useLit } from "../../../hooks/litCeramic/useLit";
import { useDeploy } from "../../../hooks/useDeploy";
import LayoutDefault from "../../../layouts/default";
import { wait } from "../../../utils/wait";
import { useTokenHolders } from "../../../hooks/useTokenHolders";
import { fetchNftBaseInfo } from "../../../utils/zdk";

const QuestionForm = (props: { idx: number, question: Question; onChanged: (question: Question, idx: number) => void; }) => {
  const [questionType, setQuestionType] = useState(props.question.questionType)
  const [questionBody, setQuestionBody] = useState(props.question.questionBody)
  const [options, setOptions] = useState(props.question.options)

  useEffect(() => {
    const question: Question = {
      questionType: questionType,
      questionBody: questionBody,
      options: options
    }
    props.onChanged(question, props.idx);
  }, [questionType, questionBody, options]);

  const setOptionText = (val: string, idx: number) => {
    setOptions((options) => {
      const records = [...options]
      records[idx].text = val
      return records
    });
  }
  const addOption = () => {
    setOptions(options => {
      return [...options, { text: "" }]
    });
  }
  const removeOption = (idx: number) => {
    setOptions(options => {
      return options.filter((_, iidx) => idx !== iidx)
    });
  }

  return (
    <Box flex='1' h={480} overflowY='scroll' borderWidth='1px' borderColor='grey' borderRadius='lg' p={4}>
      <Flex px={1}>
        <Heading as='h4' mr={8} color='white'>{props.idx + 1}.</Heading>
        <Box flex='1'>
          <FormControl >
            <Select
              color='white'
              w={240}
              required
              size='sm'
              value={questionType}
              onChange={(evt) => setQuestionType(evt.target.value as "single_choice" | "single_choice_dropdown")}>
              <option value='single_choice'>Single Choice</option>
              <option value='single_choice_dropdown'>Single Choice Dropdown</option>
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <Textarea
              color='white'
              required
              size='lg'
              placeholder="What's your age range?"
              value={questionBody}
              onChange={(evt) => setQuestionBody(evt.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color='white'>Choices</FormLabel>
            <Box>
              <VStack align='start' mt={4}>
                {options.flatMap((option, iidx) => {
                  return (
                    <Flex align='center'>
                      <Button variant='ghost' size='sm' color='white' onClick={() => removeOption(iidx)}>
                        <CloseIcon />
                      </Button>
                      <Input
                        color='white'
                        required
                        size='lg'
                        value={option.text}
                        onChange={(evt) => setOptionText(evt.target.value, iidx)} />
                    </Flex>
                  )
                })}
              </VStack>
              <Box mt={4}>
                <Button size='sm' variant='ghost' color='white' leftIcon={<AddIcon />} onClick={() => addOption()}>
                  Add
                </Button>
              </Box>
            </Box>
          </FormControl>
        </Box>
      </Flex>
    </Box >
  );
};

const Root = () => {
  const { initLitClient, isLitClientReady } = useLit();
  const { initCeramic } = useCeramic();
  const { deploy, isDeploying } = useDeploy();
  const { tokenHolders, isLoadingTokenHolders, fetchHolders } = useTokenHolders();
  const [currentIdx, setCurrentIdx] = useState(0)
  const [carouselStateKey, setCarouselStateKey] = useState(Math.random())
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS.flatMap((question) => {
    return {
      questionBody: question.questionBody,
      questionType: question.questionType,
      options: question.options.flatMap(option => {
        return { text: option.text };
      })
    };
  }));
  const router = useRouter()
  const title = router.query.title as string
  const description = router.query.description as string
  const nftaddress = router.query.nftaddress as string

  useEffect(() => {
    (async () => {
      fetchNftBaseInfo(nftaddress)
      fetchHolders(nftaddress)
    })
  }, [nftaddress]);

  useEffect(() => {
    initLitClient();
  }, [initLitClient]);

  useEffect(() => {
    initCeramic();
  }, [initCeramic]);


  const onQuestionChanged = (question: Question, idx: number) => {
    setQuestions((questions) => {
      const records = [...questions]
      records[idx].questionBody = question.questionBody
      records[idx].questionType = question.questionType
      records[idx].options = [...question.options]
      return records
    });
  }

  const addQuestion = () => {
    setQuestions(questions => {
      return [...questions, { questionBody: "", questionType: "single_choice", options: [] }]
    });
    setCurrentIdx(questions.length)
  }

  const dupQuestion = () => {
    const currentQuestion = questions[currentIdx]
    setQuestions(questions => {
      return [...questions, { questionBody: currentQuestion.questionBody, questionType: currentQuestion.questionType, options: [...currentQuestion.options] }]
    });
    setCurrentIdx(questions.length)
  }

  const removeQuestion = () => {
    setQuestions(questions => {
      return [...questions].filter((_, iidx) => currentIdx !== iidx)
    });
    setCarouselStateKey(Math.random())
  }

  const [formUrl, setFormUrl] = useState<string>("");
  const copyFormUrl = useClipboard(formUrl);
  //  const copyFormUrl = useClipboard(formUrl);

  const submit = async () => {
    const res = await deploy({
      formParams: {
        title: title as string,
        description: description as string,
        questions: questions,
      },
      formViewerAddresses: tokenHolders,
      nftAddress: nftaddress as string,
    });

    // null response means form creation failed
    if (!res) {
      return;
    }

    if (!res) return;
    setFormUrl(res.formUrl);
    await wait(3000); // wait for a few seconds for the graph to index the tx. TODO: more robust method

  };


  return (
    <LayoutDefault>
      <Box w='full' mb={32}>
        <Container maxWidth={"4xl"}>
          <Box >
            <Box>
              <Flex>
                <Button onClick={() => setCurrentIdx(currentIdx - 1)} disabled={currentIdx <= 0}><ChevronLeftIcon /></Button>
                <Spacer />
                <Heading as='h3' color='white' fontSize={18}>{`${currentIdx + 1} / ${questions.length}`}</Heading>
                <Spacer />
                <Button onClick={() => setCurrentIdx(currentIdx + 1)} disabled={questions.length <= currentIdx + 1}><ChevronRightIcon /></Button>
              </Flex>
            </Box>
            <Box>
              <Flex mt={8}>
                <Spacer />
                <Menu placement="bottom-end">
                  <MenuButton color='white' w={8} h={8}>
                    <HamburgerIcon />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => addQuestion()}>Add Question</MenuItem>
                    <MenuItem onClick={() => dupQuestion()}>Duplicate Question</MenuItem>
                    <MenuItem onClick={() => removeQuestion()}>Remove Question</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Carousel slideIndex={currentIdx} dragging={false} withoutControls={true} key={carouselStateKey}>
                {questions.flatMap((question, idx) => {
                  return <QuestionForm idx={idx} question={question} onChanged={onQuestionChanged} key={`question_${idx}`} />
                })}
              </Carousel>
              <Flex my={4}>
                <Spacer />
                <Button w={80} size='md' color='white' onClick={() => submit()} isLoading={isDeploying || isLoadingTokenHolders || !isLitClientReady} disabled={isDeploying} >
                  Submit
                </Button>
                <Spacer />
              </Flex>
            </Box>
          </Box>
        </Container>
      </Box >
    </LayoutDefault >
  );
};

export default Root;


/*
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
        <Button size="md" onClick={() => setFormStep("start")}>
          Back
        </Button>
        <Button
          ml={4}
          size="md"
          color="brand"
          onClick={onClickDeploy}
          isLoading={isDeploying}
          disabled={
            isDeploying ||
            !isLitClientReady ||
            !isFirstStepValid ||
            !isSecondStepValid
          }
        >
          Create
        </Button>
      </Flex>
    </ModalFooter>*/

/* 

{
  formStep === "form_created" && (
    <>
      <ModalBody pb={6}>
        <Heading size="md" mt={6} mb={2}>
          Form &quot;{title}&quot; has been created! 🎉
        </Heading>
        <Text>Let&lsquo;s share the form to your community members</Text>

        <Button mt={6} color="brand" onClick={onClickFormUrlCopy}>
          <CopyIcon mr={1} />
          Copy form URL
        </Button>
      </ModalBody>
      <ModalFooter>
        <Flex>
          <Button size="md" onClick={props.onClose}>
            Close
          </Button>
        </Flex>
      </ModalFooter>
    </>
  )
}*/