import {
  Box,
  Center,
  Checkbox,
  Container,
  FormControl,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import NewAnswerDialog from "../components/NewAnswerDialog";
import { Answer, FormTemplate } from "../constants/constants";
import { useCeramic } from "../hooks/litCeramic/useCeramic";
import { useLit } from "../hooks/litCeramic/useLit";
import { useFormData } from "../hooks/useFormData";
import Layout from "../layouts/account";

type AnswerInForm = Omit<Answer, "question_id">;

const FormInput = ({
  question,
  answer,
  setAnswer,
}: {
  question: FormTemplate["questions"][number];
  answer?: AnswerInForm;
  setAnswer: (a: AnswerInForm) => void;
}) => {
  const answerParams = {
    question_type: question.question_type,
  };

  const currentSingleAnswer =
    typeof answer?.answer === "object" ? "" : answer?.answer || "";
  const currentMultiAnswer =
    typeof answer?.answer === "object" ? answer?.answer : [] || [];

  switch (question.question_type as string) {
    case "text":
      return (
        <Input
          mt={8}
          placeholder="Answer Here"
          value={currentSingleAnswer}
          onChange={(e) =>
            setAnswer({ ...answerParams, answer: e.target.value })
          }
        />
      );
    case "single_choice":
      return (
        <RadioGroup
          value={currentSingleAnswer}
          onChange={(v) => setAnswer({ ...answerParams, answer: v })}
        >
          <Stack>
            {question.options.map((option, i) => (
              <Radio size="lg" key={i} value={option.text}>
                <Box color="white">{Object.values(option)[0] || ""}</Box>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      );
    case "single_choice_dropdown":
      return (
        <Select
          value={currentSingleAnswer}
          onChange={(e) =>
            setAnswer({ ...answerParams, answer: e.target.value })
          }
          placeholder="Please select"
          color="white"
          mt={8}
        >
          {question.options.map((option, i) => (
            <option key={i} value={option.text}>
              {option.text}
            </option>
          ))}
        </Select>
      );
    case "multi_choice":
      return (
        <Stack>
          {question.options.map((option, i) => (
            <Checkbox
              isChecked={currentMultiAnswer.includes(option.text)}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  setAnswer({
                    ...answerParams,
                    answer: [...currentMultiAnswer, option.text],
                  });
                } else {
                  setAnswer({
                    ...answerParams,
                    answer: currentMultiAnswer.filter((a) => a !== option.text),
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
      );
    default:
      return <></>;
  }
};

const Answer = () => {
  const {
    formData,
    isLoadingFormData: isLoading,
    fetchFormData,
  } = useFormData();
  const newAnswerModal = useDisclosure();

  const { initLitClient, getLitAuthSig } = useLit();
  const { initCeramic } = useCeramic();

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

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
    if (!formData) return;
    if (!formData.questions) return;
    if (formData.questions.length <= 0) return;
    newAnswerModal.onOpen();
  }, [formData, newAnswerModal]);

  return (
    <>
      <Layout>
        <Container>
          <Box mt={8}>
            <Center>
              <Heading as="h2" color="white" size="md" fontWeight="bold">
                {formData ? formData.title : "-"}
              </Heading>
            </Center>
          </Box>
          <Box w={"full"} mt={24}>
            <FormControl>
              <Box>
                {isLoading && (
                  <Center>
                    <Spinner size="lg" color="white" />
                  </Center>
                )}
              </Box>
            </FormControl>
          </Box>
        </Container>
      </Layout>
      {formData && (
        <NewAnswerDialog
          title={formData.title}
          questions={formData.questions}
          isOpen={newAnswerModal.isOpen}
          onOpen={newAnswerModal.onOpen}
          onClose={newAnswerModal.onClose}
        />
      )}
    </>
  );
};

export default Answer;
