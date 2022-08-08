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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Form, useFormList } from "../hooks/useFormList";
import { useLitCeramic } from "../hooks/useLitCeramic";

const FormRow = (props: Form) => {
  return (
    <Tr>
      <Td>
        <Text fontSize="md" color="white">
          {props.title}
        </Text>
      </Td>
      <Td w={16}>
        <a href={props.formUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" color="white">
            Form
          </Button>
        </a>
      </Td>
      <Td w={16}>
        <a href={props.resultUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" color="white">
            Result
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
          <Spinner size="lg" color='white' />
        </Flex>
      ) : (
        <TableContainer>
          <Table size="lg">
            <Thead>
              <Tr>
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
