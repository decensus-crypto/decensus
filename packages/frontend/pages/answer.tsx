import { Box, Center, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import NewAnswerDialog from "../components/NewAnswerDialog";
import { useCeramic } from "../hooks/litCeramic/useCeramic";
import { useLit } from "../hooks/litCeramic/useLit";
import { useFormData } from "../hooks/useFormData";
import Layout from "../layouts/account";

const AnswerPage = () => {
  const { formData, fetchStatus, fetchErrorMessage, fetchFormData } =
    useFormData();
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
        <Box w="full" mb={32}>
          <Box mt={32}>
            {fetchStatus === "pending" && (
              <>
                <Center>
                  <Spinner color="white" />
                </Center>
                <Center mt={4}>
                  <Text color="white">Initializing...</Text>
                </Center>
              </>
            )}
            {fetchStatus === "retrieving" && (
              <>
                <Center>
                  <Spinner color="white" />
                </Center>
                <Center mt={4}>
                  <Text color="white">Retrieving the form contents...</Text>
                </Center>
              </>
            )}
            {fetchStatus === "decrypting" && (
              <>
                <Center>
                  <Spinner color="white" />
                </Center>
                <Center mt={4}>
                  <Text color="white">Decrypting...</Text>
                </Center>
              </>
            )}
            {fetchStatus === "failed" && (
              <Text color="white">
                Failed :(
                <br />
                {fetchErrorMessage}
              </Text>
            )}
          </Box>
        </Box>
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

export default AnswerPage;
