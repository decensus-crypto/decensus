import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { FORM_TEMPLATE, QuestionId } from "../constants/constants";
import { useCeramic } from "../hooks/litCeramic/useCeramic";
import { useLit } from "../hooks/litCeramic/useLit";
import { useDeploy } from "../hooks/useDeploy";
import { useFormList } from "../hooks/useFormList";
import { useLitCeramic } from "../hooks/useLitCeramic";

const FormDeployButton = (props: {
  canDeploy: boolean;
  nftAddress: string;
  title: string;
  description: string;
  questionIds: QuestionId[];
  onDeployComplete: (params: { formUrl: string } | null) => void;
}) => {
  const { deploy, isDeploying } = useDeploy();
  const { initLitCeramic } = useLitCeramic();
  const { fetchFormList } = useFormList();
  const { initLitClient } = useLit();
  const { initCeramic } = useCeramic();

  useEffect(() => {
    initLitCeramic();
    initLitClient();
    initCeramic();
  }, [initCeramic, initLitCeramic, initLitClient]);

  const onSubmit = async () => {
    const res = await deploy({
      nftAddress: props.nftAddress,
      formParams: FORM_TEMPLATE({
        title: props.title,
        description: props.description,
        questionIds: props.questionIds,
      }),
    });

    // null response means form creation failed
    if (!res) {
      return;
    }

    props.onDeployComplete(res);
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
        disabled={isDeploying || !props.canDeploy}
      >
        Create
      </Button>
    </>
  );
};

export default FormDeployButton;
