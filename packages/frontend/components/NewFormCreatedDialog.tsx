import { Button } from "@chakra-ui/react";

import { CopyIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { createToast } from "../utils/createToast";

const NewFormCreatedDialog = (props: {
  title: string;
  formUrl: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const copyFormUrl = useClipboard(props.formUrl);
  const onClickFormUrlCopy = () => {
    copyFormUrl.onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new form with our template</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Heading size="md" mt={6} mb={2}>
            Form &quot;{props.title}&quot; has been created! 🎉
          </Heading>
          <Text>Let&lsquo;s share the form to your community members</Text>
          <Button mt={6} color="brand" onClick={onClickFormUrlCopy}>
            <CopyIcon mr={1} />
            Copy form URL
          </Button>
        </ModalBody>
        <ModalFooter>
          <Flex>
            <Button size="md" onClick={props.onClose}>
              Close
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewFormCreatedDialog;
