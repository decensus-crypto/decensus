import { Box, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAnswerSubmission } from "../hooks/useAnswerForm";
import { useLitCeramic } from "../hooks/useLitCeramic";

const AnswerFormTest = () => {
  const { formData, fetchFormData, submitAnswer } = useAnswerSubmission();
  const { initLitCeramic } = useLitCeramic();

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  const onSubmit = async () => {
    await submitAnswer({
      submissionStrToEncrypt: "hello",
    });
  };

  return (
    <>
      <Box>{JSON.stringify(formData)}</Box>
      <Button
        ml={4}
        size="md"
        variant="outline"
        color="#FC8CC9"
        onClick={onSubmit}
      >
        Save
      </Button>
    </>
  );
};

export default AnswerFormTest;
