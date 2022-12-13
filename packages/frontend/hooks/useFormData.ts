import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { CHAIN_NAME } from "../constants/constants";
import { Form } from "../types";
import { decompressFromBase64 } from "../utils/stringCompression";
import { useCeramic } from "./litCeramic/useCeramic";
import { useLit } from "./litCeramic/useLit";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";

const formDataAtom = atom<(Form & { closed: boolean; alreadyAnswered: boolean }) | null>(null);
const nftAddressAtom = atom<string | null>(null);
const formViewerAddressesAtom = atom<string[] | null>(null);
const fetchStatusAtom = atom<"pending" | "retrieving" | "decrypting" | "completed" | "failed">(
  "pending",
);
const fetchErrorMessageAtom = atom<string | null>(null);

export const useFormData = () => {
  const { loadDocument, isCeramicReady } = useCeramic();
  const { decryptWithLit, isLitClientReady, litAuthSig } = useLit();
  const { account } = useAccount();
  const { getFormCollectionContract } = useContracts();

  const [formData, setFormData] = useAtom(formDataAtom);
  const [nftAddress, setNftAddress] = useAtom(nftAddressAtom);
  const [formViewerAddresses, setFormViewerAddresses] = useAtom(formViewerAddressesAtom);
  const [fetchStatus, setFetchStatus] = useAtom(fetchStatusAtom);
  const [fetchErrorMessage, setFetchErrorMessage] = useAtom(fetchErrorMessageAtom);

  const fetchFormData = useCallback(
    async (formCollectionAddress: string) => {
      if (!formCollectionAddress) return;
      if (!isLitClientReady) return;
      if (!litAuthSig) return;
      if (!isCeramicReady) return;
      if (!account) return;
      if (!(fetchStatus === "pending" || fetchStatus === "failed")) return;

      const formCollectionContract = getFormCollectionContract(formCollectionAddress);
      if (!formCollectionContract) return;

      try {
        setFetchStatus("retrieving");

        const [formDataUri, closed, answeredNum] = await Promise.all([
          formCollectionContract.formDataURI(),
          formCollectionContract.closed(),
          formCollectionContract.balanceOf(account),
        ]);

        if (formDataUri.slice(0, 10) !== "ceramic://")
          throw new Error("Form data storage other than Ceramic is not supported");

        const formDataStreamId = formDataUri.split("//").slice(-1)[0];

        const formDataInCeramic = await loadDocument(formDataStreamId);
        try {
          setFetchStatus("decrypting");
          const { encryptedFormData, addressesToAllowRead, nftAddress } = JSON.parse(
            decompressFromBase64(formDataInCeramic),
          );

          const formDataStr = await decryptWithLit({
            encryptedZipBase64: encryptedFormData.encryptedZipBase64,
            encryptedSymmKeyBase64: encryptedFormData.encryptedSymmKeyBase64,
            nftAddressToAllowRead: nftAddress,
            chain: CHAIN_NAME,
          });
          const formData = {
            ...JSON.parse(formDataStr),
            closed,
            alreadyAnswered: answeredNum > 0,
          };

          setFetchStatus("completed");
          setNftAddress(nftAddress);
          setFormData(formData);
          setFormViewerAddresses(addressesToAllowRead);
        } catch (error) {
          console.error(error);
          throw new Error("invalid form data");
        }
      } catch (error: any) {
        console.error(error);
        setFetchStatus("failed");
        setFetchErrorMessage(error.message);
      }
    },
    [
      account,
      decryptWithLit,
      fetchStatus,
      getFormCollectionContract,
      isCeramicReady,
      isLitClientReady,
      litAuthSig,
      loadDocument,
      setFetchErrorMessage,
      setFetchStatus,
      setFormData,
      setFormViewerAddresses,
      setNftAddress,
    ],
  );

  return {
    formData,
    nftAddress,
    fetchStatus,
    fetchErrorMessage,
    formViewerAddresses,
    fetchFormData,
  };
};
