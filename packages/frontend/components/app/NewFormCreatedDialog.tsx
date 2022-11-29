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
import { createToast } from "../../utils/createToast";

export default function NewFormCreatedDialog(props: {
  title: string;
  formUrl: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { onCopy: onCopyFormUrl } = useClipboard(props.formUrl);

  const clickFormUrlCopy = () => {
    onCopyFormUrl();
    createToast({
      title: "Link Copied!",
      status: "success",
    });
  };
  return (
    <>
      <Modal isCentered isOpen={props.isOpen} onClose={props.onOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader as="h2" fontWeight="light" color="gray">
            {props.title} is Published!
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Completed!
              <br />
              Let&lsquo;s share the form to your community members.
            </Text>
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
              onClick={clickFormUrlCopy}
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
}
