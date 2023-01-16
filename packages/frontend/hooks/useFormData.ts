import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { Form } from "../types";
import { decompressFromBase64 } from "../utils/stringCompression";
import { useCeramic } from "./litCeramic/useCeramic";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";

const formDataAtom = atom<(Form & { closed: boolean; alreadyAnswered: boolean }) | null>(null);
const formViewerAddressesAtom = atom<string[] | null>(null);
const fetchStatusAtom = atom<"pending" | "retrieving" | "completed" | "failed">("pending");
const fetchErrorMessageAtom = atom<string | null>(null);

export const useFormData = () => {
  const { loadDocument, isCeramicReady } = useCeramic();
  const { account } = useAccount();
  const { getFormCollectionContract } = useContracts();

  const [formData, setFormData] = useAtom(formDataAtom);
  const [formViewerAddresses, setFormViewerAddresses] = useAtom(formViewerAddressesAtom);
  const [fetchStatus, setFetchStatus] = useAtom(fetchStatusAtom);
  const [fetchErrorMessage, setFetchErrorMessage] = useAtom(fetchErrorMessageAtom);

  const fetchFormData = useCallback(
    async (formCollectionAddress: string) => {
      if (!formCollectionAddress) return;
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
          const { formParams, formViewerAddresses } = JSON.parse(
            decompressFromBase64(formDataInCeramic),
          );

          const formData = {
            ...formParams,
            closed,
            alreadyAnswered: answeredNum > 0,
          };

          setFetchStatus("completed");
          setFormData(formData);
          setFormViewerAddresses(formViewerAddresses);
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
      fetchStatus,
      getFormCollectionContract,
      isCeramicReady,
      loadDocument,
      setFetchErrorMessage,
      setFetchStatus,
      setFormData,
      setFormViewerAddresses,
    ],
  );

  return {
    formData,
    fetchStatus,
    fetchErrorMessage,
    formViewerAddresses,
    fetchFormData,
  };
};
