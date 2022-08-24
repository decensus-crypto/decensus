import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME, FormTemplate } from "../constants/constants";
import { createToast } from "../utils/createToast";
import {
  getFormCollectionContract,
  getSubmissionMarkContract,
} from "../utils/getContract";
import { decompressFromBase64 } from "../utils/stringCompression";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";
import { useFormCollectionAddress } from "./useFormCollectionAddress";
import { useLitCeramic } from "./useLitCeramic";
import { usePhormsMode } from "./usePhormsMode";
import { useSurveyIdInQuery } from "./useSurveyIdInQuery";

const formDataAtom = atom<FormTemplate | null>(null);
const nftAddressAtom = atom<string | null>(null);
const isLoadingAtom = atom<boolean>(true);
const formViewerAddressesAtom = atom<string[] | null>(null);

export const useFormData = () => {
  const { surveyId } = useSurveyIdInQuery();
  const { formCollectionAddress } = useFormCollectionAddress();

  const { litCeramicIntegration } = useLitCeramic();
  const { authenticateCeramic, createDocument, loadDocument, isCeramicReady } =
    useCeramic();
  const {
    getLitAuthSig,
    encryptWithLit,
    decryptWithLit,
    isLitClientReady,
    litAuthSig,
  } = useLit();

  const { account } = useAccount();

  const [formData, setFormData] = useAtom(formDataAtom);
  const [nftAddress, setNftAddress] = useAtom(nftAddressAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [formViewerAddresses, setFormViewerAddresses] = useAtom(
    formViewerAddressesAtom
  );

  // TODO: remove test mode
  const { isPhormsMode } = usePhormsMode();

  const fetchFormDataOld = useCallback(async () => {
    if (!surveyId || !litCeramicIntegration || !account) return;
    const submissionMarkContract = getSubmissionMarkContract();
    if (!submissionMarkContract) return;

    try {
      setIsLoading(true);

      const [formDataStr, nftAddress]: [string, string] = await Promise.all([
        litCeramicIntegration.readAndDecrypt(surveyId),
        submissionMarkContract.surveys(surveyId),
      ]);

      try {
        // should perform type validation!!!!
        const formData = JSON.parse(formDataStr);

        setFormData(formData);
      } catch {
        throw new Error("invalid form data");
      }

      setNftAddress(nftAddress);
    } catch (error: any) {
      createToast({
        title: "Failed to get form data",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    account,
    litCeramicIntegration,
    setFormData,
    setIsLoading,
    setNftAddress,
    surveyId,
  ]);

  const fetchFormDataPhorms = useCallback(async () => {
    if (
      !formCollectionAddress ||
      !isLitClientReady ||
      !litAuthSig ||
      !isCeramicReady ||
      !account
    )
      return;

    const formCollectionContract = getFormCollectionContract(
      formCollectionAddress
    );
    if (!formCollectionContract) return;

    try {
      setIsLoading(true);

      const formDataUri = await formCollectionContract.formDataURI();

      if (formDataUri.slice(0, 10) !== "ceramic://")
        throw new Error(
          "Form data storage other than Ceramic is not supported"
        );

      const formDataStreamId = formDataUri.split("//").slice(-1)[0];

      const formDataInCeramic = await loadDocument(formDataStreamId);
      try {
        const { encryptedFormData, addressesToAllowRead } = JSON.parse(
          decompressFromBase64(formDataInCeramic)
        );

        const formDataStr = await decryptWithLit({
          encryptedZipBase64: encryptedFormData.encryptedZipBase64,
          encryptedSymmKeyBase64: encryptedFormData.encryptedSymmKeyBase64,
          addressesToAllowRead,
          chain: CHAIN_NAME,
        });

        const formData = JSON.parse(formDataStr);

        setFormData(formData);
        setFormViewerAddresses(addressesToAllowRead);
      } catch (error) {
        console.error(error);
        throw new Error("invalid form data");
      }
    } catch (error: any) {
      createToast({
        title: "Failed to get form data",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    account,
    decryptWithLit,
    formCollectionAddress,
    isCeramicReady,
    isLitClientReady,
    litAuthSig,
    loadDocument,
    setFormData,
    setFormViewerAddresses,
    setIsLoading,
  ]);

  // switch the deploy function depending on the query string
  const fetchFormData = useCallback(async () => {
    if (isPhormsMode) {
      return await fetchFormDataPhorms();
    } else {
      return await fetchFormDataOld();
    }
  }, [fetchFormDataOld, fetchFormDataPhorms, isPhormsMode]);

  return {
    formData,
    nftAddress,
    surveyId,
    isLoadingFormData: isLoading,
    formCollectionAddress,
    formViewerAddresses,
    fetchFormData,
  };
};
