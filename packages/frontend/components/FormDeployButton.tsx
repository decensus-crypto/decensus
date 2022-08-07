import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FORM_TEMPLATE } from "../constants/constants";
import { useDeploy } from "../hooks/useDeploy";
import { useLitCeramic } from "../hooks/useLitCeramic";

const FormDeployButton = (props: { nftAddress: string; formName: string }) => {
  const { initLitCeramic } = useLitCeramic();
  const { deploy, isDeploying } = useDeploy();
  const [formLink, setFormLink] = useState<string | null>(null);
  const formLinkModal = useDisclosure();

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  const onSubmit = async () => {
    console.log("oke!");
    const { formLink } = await deploy({
      nftAddress: props.nftAddress,
      formParamsToEncrypt: JSON.stringify(
        FORM_TEMPLATE({ formName: props.formName })
      ),
    });
    setFormLink(formLink);
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
      {formLink && (
        <Modal {...formLinkModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Form created!</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>{formLink}</ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default FormDeployButton;
