import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useCloseSurvey } from "../hooks/useCloseSurvey";
import { Form, useFormList } from "../hooks/useFormList";

const CloseFormDialog = (props: { onClose: () => void; isOpen: boolean; formData: Form }) => {
  const { isClosing, close } = useCloseSurvey();
  const { fetchFormList } = useFormList();

  const onClickCloseSurvey = useCallback(async () => {
    const res = await close({
      formCollectionAddress: props.formData.contractAddress,
    });
    if (!res) return;

    props.onClose();
    await fetchFormList({
      overrides: [
        {
          ...props.formData,
          closed: true,
        },
      ],
    });
  }, [close, fetchFormList, props]);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent bg="gray.700">
        <ModalHeader as="h2" fontWeight="light" color="white">
          Close Survey
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Text>After you close the survey, no answers will be able to be submitted.</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} disabled={isClosing}>
            Cancel
          </Button>
          <Button onClick={onClickCloseSurvey} color="red" ml={4} isLoading={isClosing}>
            Close survey
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default CloseFormDialog;
