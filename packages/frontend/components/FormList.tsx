import { Button, Td, Text, Tr } from "@chakra-ui/react";
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
        <a href={props.url} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" color="white">
            Get Link
          </Button>
        </a>
      </Td>
    </Tr>
  );
};

const FormList = () => {
  const { formList, fetchFormList } = useFormList();
  const { initLitCeramic } = useLitCeramic();

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  useEffect(() => {
    fetchFormList();
  }, [fetchFormList]);

  return (
    <>
      {formList.map((form, index) => (
        <FormRow key={`form_row_${index}`} title={form.title} url={form.url} />
      ))}
    </>
  );
};

export default FormList;
