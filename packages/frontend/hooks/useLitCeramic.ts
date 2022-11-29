import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import type { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { ResolverRegistry } from "did-resolver";
import { DID } from "dids";
import { Contract, ContractReceipt } from "ethers";
import { atom, useAtom } from "jotai";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { useCallback } from "react";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { CHAIN_NAME } from "../constants/constants";
import { QuestionnaireForm } from "../types";
import {
  blobToBase64,
  compressToBase64,
  decodeb64,
  decompressFromBase64,
  encodeb64,
} from "../utils/converters";
import { encrypt, genKeyPair } from "../utils/crypto";
import {
  getMerkleTree,
  getMerkleTreeRootHash,
  getProofForAddress,
} from "../utils/merkleTree";

const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";
const LIT_CHAIN = "ethereum";

// Init related
const litClientAtom = atom<any | null>(null);
const ceramicClientAtom = atom<CeramicClient | null>(null);
const isLitInitializingAtom = atom<boolean>(false);
const isCeramicInitializingAtom = atom<boolean>(false);
const formUrlAtom = atom<string | null>(null);
// Deploy related
const deployStatusAtom = atom<
  "pending" | "encrypting" | "writing" | "completed" | "failed"
>("pending");
const deployErrorMessageAtom = atom<string | null>(null);
// Fetch related
const questionnaireFormAtom = atom<QuestionnaireForm | null>(null);
const fetchStatusAtom = atom<
  "pending" | "retrieving" | "decrypting" | "completed" | "failed"
>("pending");
const fetchErrorMessageAtom = atom<string | null>(null);
// Answer related
const submitAnswerStatusAtom = atom<
  "pending" | "encrypting" | "writing" | "completed" | "failed"
>("pending");
const submitAnswerErrorMessageAtom = atom<string | null>(null);

export const useLitCeramic = () => {
  const [litClient, setLitClient] = useAtom(litClientAtom);
  const [ceramicClient, setCeramicClient] = useAtom(ceramicClientAtom);
  const [isLitInitializing, setIsLitInitializing] = useAtom(
    isLitInitializingAtom
  );
  const [isCeramicInitializing, setIsCeramicInitializing] = useAtom(
    isCeramicInitializingAtom
  );
  const [formUrl, setFormUrl] = useAtom(formUrlAtom);
  const [deployStatus, setDeployStatus] = useAtom(deployStatusAtom);
  const [deployErrorMessage, setDeployErrorMessage] = useAtom(
    deployErrorMessageAtom
  );
  const [questionnaireForm, setQuestionnaireForm] = useAtom(
    questionnaireFormAtom
  );
  const [fetchStatus, setFetchStatus] = useAtom(fetchStatusAtom);
  const [fetchErrorMessage, setfetchErrorMessage] = useAtom(
    fetchErrorMessageAtom
  );
  const [submitAnswerStatus, setSubmitAnswerStatus] = useAtom(
    submitAnswerStatusAtom
  );
  const [submitAnswerErrorMessage, setSubmitAnswerErrorMessage] = useAtom(
    submitAnswerErrorMessageAtom
  );
  const accFromNftAddress = (address: string) => {
    return [
      {
        contractAddress: address,
        standardContractType: "ERC721",
        chain: LIT_CHAIN,
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">",
          value: "0",
        },
      },
    ];
  };
  const accFromAddresses = (addresses: string[]) => {
    return addresses.flatMap((a, i) => [
      ...(i === 0 ? [] : [{ operator: "or" }]),
      {
        contractAddress: "",
        standardContractType: "",
        chain: LIT_CHAIN,
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: a,
        },
      },
    ]);
  };

  const getLitAuthSig = async () => {
    return await LitJsSdk.checkAndSignAuthMessage({
      chain: CHAIN_NAME,
    });
  };

  const encryptWithLit = async (
    strToEncrypt: string,
    authSig: any,
    accessControlConditions: any
  ) => {
    if (!litClient) return;
    const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
      strToEncrypt
    );
    const encryptedSymmKey = await litClient.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig: authSig,
      chain: CHAIN_NAME,
      permanant: true,
    });
    const encryptedZipBase64 = await blobToBase64(encryptedZip);
    const encryptedSymmKeyBase64 = encodeb64(encryptedSymmKey);
    return {
      encryptedZipBase64,
      encryptedSymmKeyBase64,
    };
  };
  const decryptWithLit = async (
    authSig: any,
    encryptedZipBase64: string,
    encryptedSymmKeyBase64: string,
    accessControlConditions: any
  ) => {
    if (!litClient) return;

    const toDecrypt = uint8ArrayToString(
      decodeb64(encryptedSymmKeyBase64),
      "base16"
    );
    const decryptedSymmKey = await litClient.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt,
      chain: CHAIN_NAME,
      authSig,
    });

    // decrypt the files
    const decryptedFiles = await LitJsSdk.decryptZip(
      new Blob([decodeb64(encryptedZipBase64)]),
      decryptedSymmKey
    );
    const decryptedString = await decryptedFiles["string.txt"].async("text");
    return decryptedString;
  };

  const createDocument = async (content: string) => {
    if (!ceramicClient) return;
    const doc = await TileDocument.create(ceramicClient, content);
    return doc.id;
  };

  const loadDocument = async (id: string) => {
    if (!ceramicClient) return;
    const doc = await TileDocument.load(ceramicClient, id);
    return (await doc.content) as string;
  };

  const getFormUrl = (origin: string, surveyId: string) => {
    return `${origin}/answer?id=${surveyId}`;
  };

  const wait = async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  };

  const initLit = useCallback(async () => {
    if (litClient) return;
    if (isLitInitializing) return;
    setIsLitInitializing(true);
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    setLitClient(client);
    setIsLitInitializing(false);
  }, [litClient, setLitClient, isLitInitializing, setIsLitInitializing]);

  const initCeramic = useCallback(
    async (didProvider: any) => {
      if (ceramicClient) return;
      if (isCeramicInitializing) return;

      setIsCeramicInitializing(true);

      // dynamic import due to esm
      const ceramic = await import("@ceramicnetwork/http-client");
      const client = new ceramic.CeramicClient(CERAMIC_URL);

      const resolverRegistry: ResolverRegistry = {
        ...get3IDResolver(client),
        ...getKeyResolver(),
      };
      const did = new DID({
        provider: didProvider,
        resolver: resolverRegistry,
      });

      await did.authenticate();
      await client.setDID(did);
      setCeramicClient(client);
      setIsCeramicInitializing(false);
    },
    [
      ceramicClient,
      setCeramicClient,
      isCeramicInitializing,
      setIsCeramicInitializing,
    ]
  );

  const deployQuestionnaireForm = useCallback(
    async (
      wallet: string,
      collectionFactoryContract: Contract,
      questionnaireForm: QuestionnaireForm
    ) => {
      if (!(deployStatus === "pending" || deployStatus === "failed")) return;

      try {
        if (!litClient) {
          throw new Error("Lit initialization incomplete");
        }
        if (!ceramicClient) {
          throw new Error("Ceramic is not initialized");
        }
        if (!wallet) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }
        if (questionnaireForm.answerableWallets.length === 0) {
          throw new Error("Cannot deploy form. Make sure you connect wallet");
        }
        setDeployStatus("encrypting");
        // generate key pair for encryption of answers
        const keyPair = await genKeyPair();

        // generate Merkle tree
        const merkleTree = getMerkleTree(questionnaireForm.answerableWallets);
        const merkleRoot = getMerkleTreeRootHash(merkleTree);

        // because the auth sig got here is not reflected when executing the following processes,
        // explicitly get the sig and pass it to the encryption functions
        const authSig = await getLitAuthSig();
        const encryptedFormData = await encryptWithLit(
          JSON.stringify(questionnaireForm.questionnaire),
          authSig,
          accFromNftAddress(questionnaireForm.nftAddress)
        );
        const formDataStreamId = await createDocument(
          compressToBase64(
            JSON.stringify({
              encryptedFormData: encryptedFormData,
              addressesToAllowRead: questionnaireForm.answerableWallets,
              nftAddress: questionnaireForm.nftAddress,
            })
          )
        );
        if (!formDataStreamId) {
          throw new Error("Cannot deploy form.");
        }

        const resultViewerAddresses = [wallet]; // FIXME: this should be more flexible
        const encryptedKey = await encryptWithLit(
          keyPair.privateKey,
          authSig,
          accFromAddresses(resultViewerAddresses || [])
        );
        if (!formDataStreamId) {
          throw new Error("Cannot deploy form.");
        }
        const formDataUri = formDataStreamId.toUrl();
        const keyStreamId = await createDocument(
          compressToBase64(
            JSON.stringify({
              encryptedKey,
              addressesToAllowRead: resultViewerAddresses,
              nftAddress: questionnaireForm.nftAddress,
            })
          )
        );
        if (!keyStreamId) {
          throw new Error("Cannot deploy form.");
        }
        const answerDecryptionKeyUri = keyStreamId.toUrl();

        setDeployStatus("writing");
        const tx = await collectionFactoryContract.createFormCollection(
          questionnaireForm.questionnaire.title,
          questionnaireForm.questionnaire.description,
          merkleRoot,
          formDataUri,
          btoa(keyPair.publicKey),
          answerDecryptionKeyUri,
          {
            gasLimit: 2000000,
          }
        );
        const res: ContractReceipt = await tx.wait();
        const createdEvent = res.events?.find(
          (e) => e.event === "FormCollectionCreated"
        );
        const formCollectionAddress = createdEvent?.args
          ? createdEvent.args[0]
          : "";
        const formUrl = getFormUrl(location.origin, formCollectionAddress);
        await wait(3000); // wait for a few seconds for the graph to index the tx. TODO: more robust method
        setFormUrl(formUrl);
        setDeployStatus("completed");
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setDeployErrorMessage(error.message);
        }
        setDeployStatus("failed");
      }
    },
    [
      litClient,
      setLitClient,
      ceramicClient,
      setCeramicClient,
      formUrl,
      setFormUrl,
      deployStatus,
      setDeployStatus,
      deployErrorMessage,
      setDeployErrorMessage,
    ]
  );

  const fetchQuestionnaireForm = useCallback(
    async (questionnaireCollectionContract: Contract) => {
      if (!(fetchStatus === "pending" || fetchStatus === "failed")) return;

      try {
        if (!ceramicClient) {
          throw new Error("Ceramic is not initialized");
        }
        if (!litClient) {
          throw new Error("Ceramic is not initialized");
        }

        setFetchStatus("retrieving");
        const formDataUri = await questionnaireCollectionContract.formDataURI();
        if (formDataUri.slice(0, 10) !== "ceramic://") {
          throw new Error(
            "Form data storage other than Ceramic is not supported"
          );
        }
        const formDataStreamId = formDataUri.split("//").slice(-1)[0];
        const formDataInCeramic = await loadDocument(formDataStreamId);
        if (!formDataInCeramic) {
          throw new Error("Loading document failed with ceramic");
        }
        const { encryptedFormData, addressesToAllowRead, nftAddress } =
          JSON.parse(decompressFromBase64(formDataInCeramic));
        if (!nftAddress) {
          throw new Error(
            "Allowed wallet addresses or NFT address is not specified in Lit encyrption"
          );
        }

        setFetchStatus("decrypting");
        const authSig = await getLitAuthSig();
        const formDataStr = await decryptWithLit(
          authSig,
          encryptedFormData.encryptedZipBase64,
          encryptedFormData.encryptedSymmKeyBase64,
          accFromNftAddress(nftAddress)
        );
        const questionnaireForm = {
          questionnaire: JSON.parse(formDataStr),
          nftAddress: nftAddress,
          answerableWallets: addressesToAllowRead,
        };
        setQuestionnaireForm(questionnaireForm);
        setFetchStatus("completed");
        console.log(questionnaireForm);
      } catch (error: any) {
        console.error(error);
        if (error instanceof Error) {
          setfetchErrorMessage(error.message);
        }
        setFetchStatus("failed");
      }
    },
    [
      litClient,
      ceramicClient,
      setQuestionnaireForm,
      fetchStatus,
      setFetchStatus,
      setfetchErrorMessage,
    ]
  );

  const submitAnswers = useCallback(
    async (
      wallet: string,
      questionnaireCollectionContract: Contract,
      formViewerAddresses: string[],
      answerArr: {
        questionId: string;
        questionType: string;
        answer: string | string[];
      }[]
    ) => {
      if (
        !(submitAnswerStatus === "pending" || submitAnswerStatus === "failed")
      )
        return;

      try {
        setSubmitAnswerStatus("encrypting");
        // get Merkle proof
        const merkleTree = getMerkleTree(formViewerAddresses);
        const merkleProof = getProofForAddress(wallet, merkleTree);

        // get encryption key
        const publicKey = atob(
          await questionnaireCollectionContract.answerEncryptionKey()
        );

        // encrypt answer
        const submissionStrToEncrypt = JSON.stringify({ answers: answerArr });
        const encryptedAnswer = await encrypt({
          text: submissionStrToEncrypt,
          key: publicKey,
        });

        setSubmitAnswerStatus("writing");
        const tx = await questionnaireCollectionContract.submitAnswers(
          merkleProof,
          compressToBase64(encryptedAnswer)
        );
        await tx.wait();
        setSubmitAnswerStatus("completed");
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          setSubmitAnswerErrorMessage(error.message);
        }
        setSubmitAnswerStatus("failed");
      }
    },
    [submitAnswerStatus, setSubmitAnswerStatus, setSubmitAnswerErrorMessage]
  );

  return {
    litClient,
    ceramicClient,
    initLit,
    initCeramic,
    formUrl,
    deployStatus,
    deployErrorMessage,
    questionnaireForm,
    fetchStatus,
    fetchErrorMessage,
    submitAnswerStatus,
    submitAnswerErrorMessage,
    deployQuestionnaireForm,
    fetchQuestionnaireForm,
    submitAnswers,
  };
};
