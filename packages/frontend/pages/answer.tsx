import { Box, Center, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AnswerFormDialog from "../components/answer/AnswerFormDialog";
import { useEthers } from "../hooks/useEthers";
import { useLitCeramic } from "../hooks/useLitCeramic";
import { useWallet } from "../hooks/useWallet";
import Layout from "../layouts/wallet";

export default function Home() {
  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onClose: onCloseForm,
  } = useDisclosure();
  const formCollectionAddress = useRouter().query?.id?.toString() || null;

  const { wallet, provider, didProvider, getDidProvider } = useWallet();

  const {
    questionnaireCollectionContract,
    fetchQuestionnaireCollectionContract,
  } = useEthers();
  const {
    litClient,
    ceramicClient,
    initLit,
    initCeramic,
    questionnaireForm,
    fetchStatus,
    fetchErrorMessage,
    fetchQuestionnaireForm,
  } = useLitCeramic();

  useEffect(() => {
    if (!formCollectionAddress) return;
    if (questionnaireCollectionContract) return;
    if (!wallet) return;
    if (!provider) return;

    fetchQuestionnaireCollectionContract(
      formCollectionAddress,
      wallet,
      provider
    );
  }, [
    questionnaireCollectionContract,
    wallet,
    provider,
    fetchQuestionnaireCollectionContract,
  ]);

  useEffect(() => {
    if (!wallet) return;
    if (!provider) return;
    if (didProvider) return;
    getDidProvider();
  }, [wallet, provider, didProvider, getDidProvider]);

  useEffect(() => {
    initLit();
  }, [initLit]);

  useEffect(() => {
    if (!didProvider) return;
    initCeramic(didProvider);
  }, [didProvider, initCeramic]);

  useEffect(() => {
    if (!litClient) return;
    if (!ceramicClient) return;
    if (!questionnaireCollectionContract) return;
    fetchQuestionnaireForm(questionnaireCollectionContract);
  }, [litClient, ceramicClient, questionnaireCollectionContract]);

  useEffect(() => {
    if (!questionnaireForm) return;
    onOpenForm();
  }, [questionnaireForm]);

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
      {formCollectionAddress && (
        <AnswerFormDialog
          formCollectionAddress={formCollectionAddress}
          questionnaireForm={questionnaireForm}
          isOpen={isOpenForm}
          onOpen={onOpenForm}
          onClose={onCloseForm}
        />
      )}
    </>
  );
}
