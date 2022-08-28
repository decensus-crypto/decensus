import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME, FormTemplate } from "../constants/constants";
import { createToast } from "../utils/createToast";
import { decompressFromBase64 } from "../utils/stringCompression";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";
import { useFormCollectionAddress } from "./useFormCollectionAddress";

const formDataAtom = atom<FormTemplate | null>(null);
const isLoadingAtom = atom<boolean>(false);
const formViewerAddressesAtom = atom<string[] | null>(null);

export const useFormData = () => {
  const { formCollectionAddress } = useFormCollectionAddress();
  const { loadDocument, isCeramicReady } = useCeramic();
  const { decryptWithLit, isLitClientReady, litAuthSig } = useLit();
  const { account } = useAccount();
  const { getFormCollectionContract } = useContracts();

  const [formData, setFormData] = useAtom(formDataAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [formViewerAddresses, setFormViewerAddresses] = useAtom(
    formViewerAddressesAtom
  );

  const fetchFormData = useCallback(async () => {
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
    getFormCollectionContract,
    isCeramicReady,
    isLitClientReady,
    litAuthSig,
    loadDocument,
    setFormData,
    setFormViewerAddresses,
    setIsLoading,
  ]);

  return {
    formData,
    isLoadingFormData: isLoading,
    formCollectionAddress,
    formViewerAddresses,
    fetchFormData,
  };
};
