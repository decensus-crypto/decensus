import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon, CopyIcon, HamburgerIcon
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
  Modal,
  ModalBody,
  ModalFooter,
  Select,
  Spacer,
  Text,
  Textarea,
  useClipboard,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import Router, { useRouter } from 'next/router';
import Carousel from "nuka-carousel";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { PREDEFINED_QUESTIONS, Question } from "../../../constants/constants";
import { useCeramic } from "../../../hooks/litCeramic/useCeramic";
import { useLit } from "../../../hooks/litCeramic/useLit";
import { useDeploy } from "../../../hooks/useDeploy";
import { useTokenHolders } from "../../../hooks/useTokenHolders";
import LayoutDefault from "../../../layouts/default";
import { createToast } from "../../../utils/createToast";
import { wait } from "../../../utils/wait";
import { fetchNftBaseInfo } from "../../../utils/zdk";

const QuestionForm = (props: { idx: number, question: Question; onChanged: (question: Question, idx: number) => void; }) => {
  const [question_type, setQuestionType] = useState(props.question.question_type)
  const [question_body, setQuestionBody] = useState(props.question.question_body)
  const [options, setOptions] = useState(props.question.options)

  useEffect(() => {
    const record: Question = {
      id: props.question.id,
      question_type: question_type,
      question_body: question_body,
      options: options
    }
    props.onChanged(record, props.idx);
  }, [question_type, question_body, options]);

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
              value={question_type}
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
              value={question_body}
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

const NewForm = () => {
  const { initLitClient, isLitClientReady } = useLit();
  const { initCeramic } = useCeramic();
  const { deploy, isDeploying } = useDeploy();
  const { tokenHolders, isLoadingTokenHolders, fetchHolders } = useTokenHolders();
  const [currentIdx, setCurrentIdx] = useState(0)
  const [carouselStateKey, setCarouselStateKey] = useState(uuidv4())
  const [questions, setQuestions] = useState<Question[]>(PREDEFINED_QUESTIONS.flatMap((question) => {
    return {
      id: uuidv4(),
      question_type: question.question_type,
      question_body: question.question_body,
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
    if (!nftaddress) {
      return
    }
    fetchNftBaseInfo(nftaddress)
    fetchHolders(nftaddress)
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
      records[idx].question_type = question.question_type
      records[idx].question_body = question.question_body
      records[idx].options = [...question.options]
      return records
    });
  }

  const addQuestion = () => {
    setQuestions(questions => {
      return [...questions, {
        id: uuidv4(),
        question_type: "single_choice",
        question_body: "",
        options: []
      }]
    });
    setCurrentIdx(questions.length)
  }

  const dupQuestion = () => {
    const currentQuestion = questions[currentIdx]
    setQuestions(questions => {
      return [...questions, {
        id: uuidv4(),
        question_type: currentQuestion.question_type,
        question_body: currentQuestion.question_body,
        options: [...currentQuestion.options]
      }]
    });
    setCurrentIdx(questions.length)
  }

  const removeQuestion = () => {
    setQuestions(questions => {
      return [...questions].filter((_, iidx) => currentIdx !== iidx)
    });
    setCarouselStateKey(uuidv4())
  }

  const [formUrl, setFormUrl] = useState<string>("");
  const copyFormUrl = useClipboard(formUrl);


  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClickFormUrlCopy = () => {
    copyFormUrl.onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };


  const submit = async () => {
    const res = await deploy({
      formTemplate: {
        title: title,
        description: description,
        questions: questions,
      },
      formViewerAddresses: tokenHolders,
      nftAddress: nftaddress,
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
    <>
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

      <Modal isOpen={isOpen}
        onClose={() => {
          onClose();
          Router.push({ pathname: '/app' })
        }} isCentered>
        <ModalBody pb={6} >
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
            <Button size="md" onClick={() => {
              onClose();
            }}>
              Close
            </Button>
          </Flex>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default NewForm;
