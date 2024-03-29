import { Box, Center, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import NewAnswerDialog from "../components/NewAnswerDialog";
import { useFormData } from "../hooks/useFormData";
import Layout from "../layouts/account";

const AnswerPage = () => {
  const formCollectionAddress = useRouter().query?.id?.toString() || null;
  const { formData, fetchStatus, fetchErrorMessage, fetchFormData } = useFormData();
  const newAnswerModal = useDisclosure();

  useEffect(() => {
    if (!formCollectionAddress) {
      return;
    }
    fetchFormData(formCollectionAddress);
  }, [fetchFormData, formCollectionAddress]);

  useEffect(() => {
    if (!formData) return;
    if (!formData.questions) return;
    if (formData.questions.length <= 0) return;
    newAnswerModal.onOpen();
  }, [formData, newAnswerModal]);

  const canShowForm =
    fetchStatus === "completed" &&
    formData &&
    formCollectionAddress &&
    !formData.closed &&
    !formData.alreadyAnswered;

  return (
    <>
      <Layout>
        <Box w="full" mb={32}>
          <Box mt={32}>
            {fetchStatus === "pending" && (
              <>
                <Center>
                  <Spinner />
                </Center>
                <Center mt={4}>
                  <Text>Initializing...</Text>
                </Center>
              </>
            )}
            {fetchStatus === "retrieving" && (
              <>
                <Center>
                  <Spinner />
                </Center>
                <Center mt={4}>
                  <Text>Retrieving the form contents...</Text>
                </Center>
              </>
            )}
            {fetchStatus === "failed" && (
              <Center>
                <Text>
                  Failed :(
                  <br />
                  {fetchErrorMessage}
                </Text>
              </Center>
            )}
            {fetchStatus === "completed" && formData?.closed && (
              <Center>
                <Text>Survey closed</Text>
              </Center>
            )}
            {fetchStatus === "completed" && !formData?.closed && formData?.alreadyAnswered && (
              <Center>
                <Text>You cannot answer survey twice</Text>
              </Center>
            )}
          </Box>
        </Box>
      </Layout>
      {canShowForm && (
        <NewAnswerDialog
          formCollectionAddress={formCollectionAddress}
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
