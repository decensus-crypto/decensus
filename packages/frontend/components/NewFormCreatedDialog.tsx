import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Link,
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
import { useEffect } from "react";
import { createToast } from "../utils/createToast";

const NewFormCreatedDialog = (props: {
  title: string;
  formUrl: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  useEffect(() => {
    setValue(props.formUrl);
  }, [props.formUrl, setValue]);

  const onClickFormUrlCopy = () => {
    onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };

  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onOpen}>
        <ModalOverlay />
        <ModalContent bg="gray.700">
          <ModalHeader as="h2" fontWeight="light" color="white">
            {props.title} is Published!
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Box>
              <Text>Completed!</Text>
              <Text>Let&lsquo;s share the form to your community members.</Text>
            </Box>
            <Box mt={2}>
              <Text>Link:</Text>
              <Text>
                <Link isExternal href={props.formUrl}>
                  {props.formUrl}
                </Link>
              </Text>
            </Box>
            <Button
              mt={6}
              size="sm"
              colorScheme="pink"
              variant="outline"
              leftIcon={<CopyIcon />}
              onClick={onClickFormUrlCopy}
            >
              Copy Link
            </Button>
          </ModalBody>
          <ModalFooter>
            <Grid templateColumns="repeat(12, 1fr)" gap={4} w="100%" mt={4}>
              <GridItem colSpan={{ base: 12 }}>
                <Button size="sm" w="100%" colorScheme="pink" onClick={() => props.onClose()}>
                  Finish
                </Button>
              </GridItem>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewFormCreatedDialog;
