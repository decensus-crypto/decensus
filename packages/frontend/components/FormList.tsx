import {
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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Form, useFormList } from "../hooks/useFormList";
import { useLitCeramic } from "../hooks/useLitCeramic";
import { createToast } from "../utils/createToast";

const FormRow = (props: Form) => {
  const { onCopy } = useClipboard(props.formUrl);

  const onClickCopy = () => {
    onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };

  return (
    <Tr>
      <Td>
        <Text fontSize="md" color="white">
          {props.title}
        </Text>
      </Td>
      <Td w={16}>
        <Button size="sm" variant="outline" color="white" onClick={onClickCopy}>
          Copy form URL
        </Button>
      </Td>
      <Td w={16}>
        <a href={props.formUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" color="white">
            Go to form
          </Button>
        </a>
      </Td>
      <Td w={16}>
        <a href={props.resultUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" color="white">
            See survey results
          </Button>
        </a>
      </Td>
    </Tr>
  );
};

const FormList = () => {
  const { formList, isLoadingFormList, fetchFormList } = useFormList();
  const { initLitCeramic } = useLitCeramic();

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  useEffect(() => {
    fetchFormList();
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
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {formList
                .filter((f) => !!f.title && !!f.formUrl)
                .map((form, index) => (
                  <FormRow
                    key={`form_row_${index}`}
                    title={form.title}
                    formUrl={form.formUrl}
                    resultUrl={form.resultUrl}
                  />
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default FormList;
