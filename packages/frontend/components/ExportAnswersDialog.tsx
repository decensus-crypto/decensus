import {
  Button,
  Center,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { CSVLink } from "react-csv";
import { useCeramic } from "../hooks/litCeramic/useCeramic";
import { useLit } from "../hooks/litCeramic/useLit";
import { useAccount } from "../hooks/useAccount";
import { useFormData } from "../hooks/useFormData";
import { useResult } from "../hooks/useResult";

const ExportAnswersDialog = (props: {
  useFormCollectionAddress: string;
  title: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { initLitClient, getLitAuthSig } = useLit();
  const { initCeramic } = useCeramic();
  const { formData, fetchStatus, fetchFormData } = useFormData();
  const { isLoadingAnswersList, answersList, fetchResults } = useResult();
  const { account } = useAccount();

  useEffect(() => {
    if (!props.isOpen) return;
    initLitClient();
  }, [props.isOpen, initLitClient]);

  useEffect(() => {
    if (!props.isOpen) return;
    getLitAuthSig();
  }, [props.isOpen, getLitAuthSig]);

  useEffect(() => {
    if (!props.isOpen) return;
    initCeramic();
  }, [props.isOpen, initCeramic]);

  useEffect(() => {
    if (!props.isOpen) return;
    fetchFormData(props.useFormCollectionAddress);
  }, [props.isOpen, fetchFormData, props.useFormCollectionAddress]);

  useEffect(() => {
    if (!props.isOpen) return;
    fetchResults(props.useFormCollectionAddress);
  }, [props.isOpen, fetchResults]);

  const questions = formData?.questions;

  const isLoadingFormData = useMemo(() => {
    return ["retrieving", "decrypting"].some(
      (status) => fetchStatus === status
    );
  }, [fetchStatus]);

  const csvData = useMemo(() => {
    if (!answersList || !questions) return [];

    let csvData = [["question_id", "question_body", "question_type", "answer"]];
    answersList.forEach((answer) => {
      answer.answers.forEach((ans) => {
        const question = questions.find((q) => q.id === ans.question_id);
        if (question) {
          csvData.push([
            question.id,
            question.question_body,
            question.question_type,
            ans.answer.toString(),
          ]);
        }
      });
    });
    return csvData;
  }, [answersList, questions]);

  const status = useMemo(():
    | "pending"
    | "loading"
    | "completed"
    | "completed_zero" => {
    if (isLoadingAnswersList || isLoadingFormData) {
      return "loading";
    }
    if (
      (!isLoadingAnswersList && answersList && answersList.length === 0) ||
      !account
    ) {
      return "completed_zero";
    }
    if (!isLoadingAnswersList && answersList && 0 < answersList.length) {
      return "completed";
    }
    return "pending";
  }, [account, answersList, isLoadingAnswersList, isLoadingFormData]);

  return (
    <Modal
      isCentered
      isOpen={props.isOpen}
      onClose={props.onClose}
      key={`export_answers_dialog_${props.useFormCollectionAddress}`}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h2" fontWeight="light" color="gray">
          Exporting answers...
        </ModalHeader>
        <ModalBody>
          {status === "pending" && (
            <>
              <Center>
                <Spinner />
              </Center>
              <Center mt={4}>
                <Text>Initializing...</Text>
              </Center>
            </>
          )}
          {status === "loading" && (
            <>
              <Center>
                <Spinner />
              </Center>
              <Center mt={4}>
                <Text>Downloading...</Text>
              </Center>
            </>
          )}
          {status === "completed_zero" && <Text>No results to show</Text>}
          {status === "completed" && (
            <>
              <Text>Ready to Downlaod</Text>
              <CSVLink
                data={csvData}
                filename={`result-${props.useFormCollectionAddress}file.csv`}
              >
                <Button size="sm" colorScheme="pink" mt={2}>
                  Download
                </Button>
              </CSVLink>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%" mt={4}>
            <GridItem colSpan={{ base: 12 }}>
              <Button
                size="sm"
                w="100%"
                onClick={() => {
                  props.onClose();
                }}
              >
                Close
              </Button>
            </GridItem>
          </Grid>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportAnswersDialog;
