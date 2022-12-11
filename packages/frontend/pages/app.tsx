import {
  AddIcon,
  CopyIcon,
  EditIcon,
  LinkIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Spacer,
  Spinner,
  Text,
  useBreakpointValue,
  useClipboard,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CloseFormDialog from "../components/CloseFormDialog";
import ExportAnswersDialog from "../components/ExportAnswersDialog";
import NewFormCreatedDialog from "../components/NewFormCreatedDialog";
import NewFormInfoDialog from "../components/NewFormInfoDialog";
import NewFormQuestionsDialog from "../components/NewFormQuestionsDialog";
import { useAccount } from "../hooks/useAccount";
import { Form, useFormList } from "../hooks/useFormList";
import Layout from "../layouts/account";
import { createToast } from "../utils/createToast";

const FormGrid = (props: {
  title: string;
  formUrl: string;
  closed: boolean;
  onClickCopy: () => void;
  onClickResult: () => void;
  onClickClose: () => void;
}) => {
  return (
    <>
      <CardHeader px={1} py={4}>
        <Text color="white">{props.title}</Text>
      </CardHeader>
      <Divider color="gray" />
      <CardBody mt={2} p={1}>
        <Grid templateColumns="repeat(12, 1fr)" gap={2}>
          <GridItem colSpan={6}>
            <Button
              width="full"
              size="sm"
              color="white"
              colorScheme="white"
              variant="outline"
              leftIcon={<CopyIcon />}
              onClick={props.onClickCopy}
            >
              Copy Link
            </Button>
          </GridItem>
          <GridItem colSpan={6}>
            <Link isExternal href={props.formUrl}>
              <Button
                width={"full"}
                size="sm"
                color="white"
                colorScheme="white"
                variant="outline"
                leftIcon={<EditIcon />}
              >
                Open
              </Button>
            </Link>
          </GridItem>
          <GridItem colSpan={6}>
            <Button
              width={"full"}
              size="sm"
              color="white"
              colorScheme="white"
              variant="outline"
              leftIcon={<LinkIcon />}
              onClick={props.onClickResult}
            >
              See Results
            </Button>
          </GridItem>
          <GridItem colSpan={6}>
            <Button
              width={"full"}
              size="sm"
              color="white"
              colorScheme="white"
              variant="outline"
              leftIcon={<NotAllowedIcon />}
              onClick={props.onClickClose}
            >
              {props.closed ? "Closed" : "Close Survey"}
            </Button>
          </GridItem>
        </Grid>
      </CardBody>
    </>
  );
};
const FormRow = (props: {
  title: string;
  formUrl: string;
  closed: boolean;
  onClickCopy: () => void;
  onClickResult: () => void;
  onClickClose: () => void;
}) => {
  return (
    <>
      <Flex align="center">
        <Text color="white">{props.title}</Text>
        <Spacer />
        <Box>
          <Button
            size="sm"
            color="white"
            colorScheme="white"
            variant="outline"
            leftIcon={<CopyIcon />}
            onClick={props.onClickCopy}
          >
            Copy Link
          </Button>
        </Box>
        <Box ml={2}>
          <Link isExternal href={props.formUrl}>
            <Button
              size="sm"
              color="white"
              colorScheme="white"
              variant="outline"
              leftIcon={<EditIcon />}
            >
              Go to Form
            </Button>
          </Link>
        </Box>
        <Box ml={2}>
          <Button
            size="sm"
            color="white"
            colorScheme="white"
            variant="outline"
            leftIcon={<LinkIcon />}
            onClick={props.onClickResult}
          >
            Survey Results
          </Button>
        </Box>
        <Box ml={2}>
          <Button
            width={128}
            size="sm"
            color="white"
            colorScheme="white"
            variant="outline"
            leftIcon={<NotAllowedIcon />}
            onClick={props.onClickClose}
            disabled={props.closed}
          >
            {props.closed ? "Closed" : "Close Survey"}
          </Button>
        </Box>
      </Flex>
    </>
  );
};

const FormItem = (props: Form) => {
  const { onCopy } = useClipboard(props.formUrl);
  const itemType = useBreakpointValue({
    base: "grid",
    md: "row",
  });
  const closeSurveyModal = useDisclosure();
  const exportAnswersModal = useDisclosure();

  const onClickCopy = () => {
    onCopy();
    createToast({
      title: "Form URL copied!",
      status: "success",
    });
  };
  const onClickResult = () => {
    exportAnswersModal.onOpen();
  };
  const onClickClose = () => {
    closeSurveyModal.onOpen();
  };

  return (
    <>
      <Card bg="gray.700" p={2} mt={2}>
        {itemType == "grid" && (
          <FormGrid
            title={props.title}
            formUrl={props.formUrl}
            closed={props.closed}
            onClickCopy={onClickCopy}
            onClickResult={onClickResult}
            onClickClose={onClickClose}
          />
        )}
        {itemType == "row" && (
          <FormRow
            title={props.title}
            formUrl={props.formUrl}
            closed={props.closed}
            onClickCopy={onClickCopy}
            onClickResult={onClickResult}
            onClickClose={onClickClose}
          />
        )}
      </Card>
      <CloseFormDialog
        onClose={closeSurveyModal.onClose}
        isOpen={closeSurveyModal.isOpen}
        formData={props}
      />
      <ExportAnswersDialog
        useFormCollectionAddress={props.contractAddress}
        title={props.title}
        isOpen={exportAnswersModal.isOpen}
        onOpen={exportAnswersModal.onOpen}
        onClose={exportAnswersModal.onClose}
      />
    </>
  );
};

const FormList = (props: { onCreateFormClicked: () => void }) => {
  const { formList, isLoadingFormList, fetchFormList } = useFormList();

  useEffect(() => {
    fetchFormList({});
  }, [fetchFormList]);

  return (
    <>
      {isLoadingFormList ? (
        <Center>
          <Spinner size="lg" color="white" />
        </Center>
      ) : (
        <>
          {formList && 0 < formList.length ? (
            <>
              {formList.flatMap((form, index) => {
                return <FormItem key={`form_row_${index}`} {...form} />;
              })}
            </>
          ) : (
            <Center mt={24}>
              <Button
                size="lg"
                colorScheme="pink"
                onClick={props.onCreateFormClicked}
              >
                Create My First Form
              </Button>
            </Center>
          )}
        </>
      )}
    </>
  );
};

const App = () => {
  const { account } = useAccount();
  // modal control
  const newFormInfoModal = useDisclosure();
  const newFormQuestionsModal = useDisclosure();
  const newFormCreatedModal = useDisclosure();
  // key of the modal component. By changing this key, force the modal component to be refreshed.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [formUrl, setFormUrl] = useState("");

  return (
    <>
      <Layout>
        <Box w="full" mb={32}>
          <Grid mt={8} templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12 }}>
              <Heading as="h2" size="md" fontWeight="light" color="white">
                Form Management
              </Heading>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Button
                leftIcon={<AddIcon />}
                size="sm"
                color="white"
                colorScheme="whiteAlpha"
                onClick={newFormInfoModal.onOpen}
                disabled={!account}
              >
                Create New Form
              </Button>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Divider color="gray" />
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              <Heading as="h3" size="sm" fontWeight="bold" color="white" mt={2}>
                Forms
              </Heading>
            </GridItem>
            <GridItem colSpan={{ base: 12 }}>
              {account ? (
                <FormList onCreateFormClicked={newFormInfoModal.onOpen} />
              ) : (
                <Center mt={24}>
                  <Text size="sm" color="white">
                    Connect wallet to start
                  </Text>
                </Center>
              )}
            </GridItem>
          </Grid>
        </Box>
      </Layout>
      <NewFormInfoDialog
        isOpen={newFormInfoModal.isOpen}
        onOpen={newFormInfoModal.onOpen}
        onClose={newFormInfoModal.onClose}
        onNext={(title, description, contractAddress) => {
          newFormInfoModal.onClose();
          setTitle(title);
          setDescription(description);
          setContractAddress(contractAddress);
          newFormQuestionsModal.onOpen();
        }}
      />
      <NewFormQuestionsDialog
        title={title}
        description={description}
        contractAddress={contractAddress}
        isOpen={newFormQuestionsModal.isOpen}
        onOpen={newFormQuestionsModal.onOpen}
        onClose={newFormQuestionsModal.onClose}
        onCreated={(formUrl) => {
          setFormUrl(formUrl);
          newFormQuestionsModal.onClose();
          newFormCreatedModal.onOpen();
        }}
      />
      <NewFormCreatedDialog
        title={title}
        formUrl={formUrl}
        isOpen={newFormCreatedModal.isOpen}
        onOpen={newFormCreatedModal.onOpen}
        onClose={newFormCreatedModal.onClose}
      />
    </>
  );
};

export default App;
