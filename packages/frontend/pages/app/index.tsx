import { AddIcon, CopyIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";
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
import NewFormCreatedDialog from "../../components/app/NewFormCreatedDialog";
import NewFormInfoDialog from "../../components/app/NewFormInfoDialog";
import NewFormQuestionsDialog from "../../components/app/NewFormQuestionsDialog";
import { useTheGraph } from "../../hooks/useTheGraph";
import { useWallet } from "../../hooks/useWallet";
import Layout from "../../layouts/wallet";
import { QuestionnaireLink } from "../../types";
import { createToast } from "../../utils/createToast";

const QuestionnaireLinkGrid = (props: { item: QuestionnaireLink }) => {
  const { onCopy } = useClipboard(props.item.formUrl);
  const clickCopy = () => {
    onCopy();
    createToast({
      title: "LINK Copied!",
      status: "success",
    });
  };
  return (
    <>
      <CardHeader px={1} py={4}>
        <Text color="white">{props.item.title}</Text>
      </CardHeader>
      <Divider color="gray" />
      <CardBody p={1}>
        <Button
          width="full"
          size="sm"
          color="white"
          colorScheme="white"
          mt={2}
          variant="outline"
          leftIcon={<CopyIcon />}
          onClick={clickCopy}
        >
          Copy Link
        </Button>
        <Link isExternal href={props.item.formUrl}>
          <Button
            mt={2}
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
        <Link href={props.item.resultUrl}>
          <Button
            mt={2}
            width={"full"}
            size="sm"
            color="white"
            colorScheme="white"
            variant="outline"
            leftIcon={<LinkIcon />}
          >
            See Results
          </Button>
        </Link>
      </CardBody>
    </>
  );
};

const QuestionnaireLinkRow = (props: { item: QuestionnaireLink }) => {
  const { onCopy } = useClipboard(props.item.formUrl);
  const clickCopy = () => {
    onCopy();
    createToast({
      title: "Link Copied!",
      status: "success",
    });
  };
  return (
    <Flex align="center">
      <Text color="white">{props.item.title}</Text>
      <Spacer />
      <Box>
        <Button
          size="sm"
          color="white"
          colorScheme="white"
          variant="outline"
          leftIcon={<CopyIcon />}
          onClick={clickCopy}
        >
          Copy Link
        </Button>
      </Box>
      <Box ml={2}>
        <Link isExternal href={props.item.formUrl}>
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
        <Link href={props.item.resultUrl}>
          <Button
            size="sm"
            color="white"
            colorScheme="white"
            variant="outline"
            leftIcon={<LinkIcon />}
          >
            Survey Results
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

const QuestionnaireLinkCard = (props: { item: QuestionnaireLink }) => {
  const itemType = useBreakpointValue({
    base: "grid",
    md: "row",
  });
  return (
    <Card bg="gray.700" p={2} mt={2}>
      {itemType == "grid" && <QuestionnaireLinkGrid item={props.item} />}
      {itemType == "row" && <QuestionnaireLinkRow item={props.item} />}
    </Card>
  );
};

const QuestionnaireList = (props: { onCreateFormClicked: () => void }) => {
  const { wallet, walletStatus } = useWallet();
  const {
    questionnaireLinks,
    isLoadingQuestionnaireLinks,
    fetchQuestionnaireLinks,
  } = useTheGraph();

  useEffect(() => {
    if (!wallet) return;
    if (walletStatus !== "connected") return;

    fetchQuestionnaireLinks(wallet);
  }, [wallet, walletStatus]);

  return (
    <>
      {isLoadingQuestionnaireLinks ? (
        <Center>
          <Spinner size="lg" color="white" />
        </Center>
      ) : (
        <>
          {questionnaireLinks && 0 < questionnaireLinks.length ? (
            <>
              {questionnaireLinks.flatMap((questionnaireLink, idx) => {
                return <QuestionnaireLinkCard item={questionnaireLink} />;
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

export default function AppHome() {
  const { wallet, walletStatus } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nftAddress, setNftAddress] = useState("");
  const [formUrl, setFormUrl] = useState("");

  const {
    questionnaireLinks,
    isLoadingQuestionnaireLinks,
    fetchQuestionnaireLinks,
  } = useTheGraph();

  useEffect(() => {
    if (!wallet) return;
    if (walletStatus !== "connected") return;
    fetchQuestionnaireLinks(wallet);
  }, [wallet, walletStatus]);

  const {
    isOpen: isOpenInfo,
    onOpen: onOpenInfo,
    onClose: onCloseInfo,
  } = useDisclosure();
  const {
    isOpen: isOpenBody,
    onOpen: onOpenBody,
    onClose: onCloseBody,
  } = useDisclosure();
  const {
    isOpen: isOpenCreated,
    onOpen: onOpenCreated,
    onClose: onCloseCreated,
  } = useDisclosure();

  const clickNext = (
    title: string,
    description: string,
    nftAddress: string
  ) => {
    setTitle(title);
    setDescription(description);
    setNftAddress(nftAddress);
    onOpenBody();
  };
  const onQuestionnaireCreated = (formUrl: string) => {
    setFormUrl(formUrl);
    onOpenCreated();
  };

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
                colorScheme="whiteAlpha"
                onClick={onOpenInfo}
                disabled={walletStatus !== "connected"}
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
              {walletStatus === "connected" ? (
                <QuestionnaireList onCreateFormClicked={onOpenInfo} />
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
        isOpen={isOpenInfo}
        onOpen={onOpenInfo}
        onClose={onCloseInfo}
        onSubmit={clickNext}
      />
      <NewFormQuestionsDialog
        title={title}
        description={description}
        nftAddress={nftAddress}
        isOpen={isOpenBody}
        onOpen={onOpenBody}
        onClose={onCloseBody}
        onQuestionnaireCreated={onQuestionnaireCreated}
      />
      <NewFormCreatedDialog
        title={title}
        formUrl={formUrl}
        isOpen={isOpenCreated}
        onOpen={onOpenCreated}
        onClose={onCloseCreated}
      />
    </>
  );
}
