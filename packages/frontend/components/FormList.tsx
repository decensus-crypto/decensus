import { CopyIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Form, useFormList } from "../hooks/useFormList";
import { createToast } from "../utils/createToast";
import { CloseSurveyModal } from "./CloseSurveyModal";

const FormRow = (props: Form) => {
  const { onCopy } = useClipboard(props.formUrl);
  const closeSurveyModal = useDisclosure();

  const onClickCopy = () => {
    onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };

  return (
    <>
      <Tr>
        <Td>
          <Text fontSize="md" color="white">
            {props.title}
          </Text>
        </Td>
        <Td w={32}>
          <Flex>
            <Box>
              <Button leftIcon={<CopyIcon />} onClick={onClickCopy}>
                Copy URL
              </Button>
            </Box>
            <Box ml={2}>
              <a href={props.formUrl} target="_blank" rel="noreferrer">
                <Button leftIcon={<EditIcon />}>Go to Form</Button>
              </a>
            </Box>
            <Box ml={2}>
              <a href={props.resultUrl} target="_blank" rel="noreferrer">
                <Button leftIcon={<LinkIcon />}>Survey Results</Button>
              </a>
            </Box>
            <Box ml={2}>
              <Button onClick={closeSurveyModal.onOpen} disabled={props.closed}>
                {props.closed ? "Survey closed" : "Close Survey"}
              </Button>
            </Box>
          </Flex>
        </Td>
      </Tr>
      <CloseSurveyModal
        onClose={closeSurveyModal.onClose}
        isOpen={closeSurveyModal.isOpen}
        formData={props}
      />
    </>
  );
};

const FormList = () => {
  const { formList, isLoadingFormList, fetchFormList } = useFormList();

  useEffect(() => {
    fetchFormList({});
  }, [fetchFormList]);

  return (
    <>
      {isLoadingFormList ? (
        <Flex w="100%" h="500px" align="center" justify="center">
          <Spinner size="lg" color="white" />
        </Flex>
      ) : (
        <TableContainer>
          <Table size="lg">
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {(formList || [])
                .filter((f) => !!f.title && !!f.formUrl)
                .map((form, index) => (
                  <FormRow key={`form_row_${index}`} {...form} />
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default FormList;
