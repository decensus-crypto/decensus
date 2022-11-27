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
import { useFormList } from "../hooks/useFormList";

export const CloseSurveyModal = (props: {
  onClose: () => void;
  isOpen: boolean;
  formCollectionAddress: string;
}) => {
  const { isClosing, close } = useCloseSurvey();
  const { fetchFormList } = useFormList();

  const onClickCloseSurvey = useCallback(async () => {
    await close({ formCollectionAddress: props.formCollectionAddress });
    props.onClose();
    await fetchFormList();
  }, [close, fetchFormList, props]);

  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Close survey</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            After you close the survey, no answers will be able to be submitted.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose} disabled={isClosing}>
            Cancel
          </Button>
          <Button
            onClick={onClickCloseSurvey}
            color="red"
            ml={4}
            isLoading={isClosing}
          >
            Close survey
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
