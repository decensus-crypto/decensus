import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useControllableState,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect } from "react";
import { useAnswerForm } from "../hooks/useAnswerForm";
import { useLitCeramic } from "../hooks/useLitCeramic";

const AnswerForm = () => {
  const {
    formData,
    nftAddress,
    isLoadingFormData: isLoading,
    isSubmitting,
    fetchFormData,
    submitAnswer,
  } = useAnswerForm();
  const { initLitCeramic } = useLitCeramic();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useControllableState({
    defaultValue: 0,
  });

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  const question = formData
    ? formData["questions"].filter((q, i) => i === currentQuestionIndex)[0] ||
      null
    : null;

  if (!formData || !question) return <></>;

  return (
    <>
      <Box mt={8}>
        <Center>
          <Heading as="h2" color="white" size="sm" fontWeight="bold">
            {formData ? formData.title : "-"}
          </Heading>
        </Center>
      </Box>
      <Box w={"full"} mt={24}>
        <FormControl>
          <Box>
            <Box>
              <FormLabel color="white" size="xl">
                <Heading as="h3" color="white" size="lg" fontWeight="light">
                  {`${currentQuestionIndex + 1}. ${question.question_body}`}
                </Heading>
              </FormLabel>
              {question.question_type === "text" && (
                <Input mt={8} placeholder="Answer Here" />
              )}
              {question.question_type === "single_choice" && (
                <RadioGroup>
                  <Stack>
                    {question.options.map((choice, i) => (
                      <Radio size="lg" key={i}>
                        <Box color="white">
                          {Object.values(choice)[0] || ""}
                        </Box>
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              )}
              {question.question_type === "multi_choice" && (
                <Stack>
                  {question.options.map((choice, i) => (
                    <Checkbox size="lg" key={i}>
                      <Box color="white">{Object.values(choice)[0] || ""}</Box>
                    </Checkbox>
                  ))}
                </Stack>
              )}
              <Center mt={8}>
                {currentQuestionIndex < formData.questions.length - 1 && (
                  <Flex>
                    <Button
                      size="lg"
                      mr={8}
                      variant="text"
                      color="white"
                      disabled={currentQuestionIndex === 0}
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex - 1)
                      }
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      ml={8}
                      variant="outline"
                      color="white"
                      onClick={() =>
                        setCurrentQuestionIndex(currentQuestionIndex + 1)
                      }
                    >
                      Next
                    </Button>
                  </Flex>
                )}
                {currentQuestionIndex >= formData.questions.length - 1 && (
                  <NextLink href="/result">
                    <Button size="lg" variant="outline" color="white">
                      Submit
                    </Button>
                  </NextLink>
                )}
              </Center>
            </Box>
          </Box>
        </FormControl>
      </Box>
    </>
  );
};

export default AnswerForm;
