import { Button } from "@chakra-ui/react";

import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
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
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onOpen}>
        <ModalOverlay />
        <ModalContent bg="gray.700">
          <ModalHeader as="h2" fontWeight="light" color="white">
            {props.title} is Published!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="white">
              Completed!
              <br />
              Let&lsquo;s share the form to your community members.
            </Text>
            <Box mt={2}>
              <Text fontSize="sm" color="white">
                Link:
              </Text>
              <Text fontSize="sm" color="white">
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
                <Button
                  size="sm"
                  w="100%"
                  colorScheme="pink"
                  onClick={() => props.onClose()}
                >
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
