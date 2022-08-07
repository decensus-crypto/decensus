import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { FORM_TEMPLATE } from "../constants/constants";
import { useDeploy } from "../hooks/useDeploy";
import { useFormList } from "../hooks/useFormList";
import { useLitCeramic } from "../hooks/useLitCeramic";

const FormDeployButton = (props: { nftAddress: string; title: string }) => {
  const { deploy, isDeploying } = useDeploy();
  const { initLitCeramic } = useLitCeramic();
  const { fetchFormList } = useFormList();

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  const onSubmit = async () => {
    await deploy({
      nftAddress: props.nftAddress,
      formParamsToEncrypt: JSON.stringify(
        FORM_TEMPLATE({ title: props.title })
      ),
    });
    await fetchFormList();
  };

  return (
    <>
      <Button
        ml={4}
        size="md"
        variant="outline"
        color="#FC8CC9"
        onClick={onSubmit}
        isLoading={isDeploying}
      >
        Save
      </Button>
    </>
  );
};

export default FormDeployButton;
