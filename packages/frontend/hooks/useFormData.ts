import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { Form } from "../types/core";
import { FormInStorage } from "../types/storage";
import { loadJsonFromIpfs } from "../utils/ipfs";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";

const formDataAtom = atom<(Form & { closed: boolean; alreadyAnswered: boolean }) | null>(null);
const respondentAddressesAtom = atom<string[] | null>(null);
const fetchStatusAtom = atom<"pending" | "retrieving" | "completed" | "failed">("pending");
const fetchErrorMessageAtom = atom<string | null>(null);

export const useFormData = () => {
  const { account } = useAccount();
  const { getFormCollectionContract } = useContracts();

  const [formData, setFormData] = useAtom(formDataAtom);
  const [respondentAddresses, setFormViewerAddresses] = useAtom(respondentAddressesAtom);
  const [fetchStatus, setFetchStatus] = useAtom(fetchStatusAtom);
  const [fetchErrorMessage, setFetchErrorMessage] = useAtom(fetchErrorMessageAtom);

  const fetchFormData = useCallback(
    async (formCollectionAddress: string) => {
      if (!formCollectionAddress) return;
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

        const { form, respondentAddresses } = await loadJsonFromIpfs<FormInStorage>(formDataUri);

        try {
          const formData = {
            ...form,
            closed,
            alreadyAnswered: answeredNum > 0,
          };

          setFetchStatus("completed");
          setFormData(formData);
          setFormViewerAddresses(respondentAddresses);
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
    respondentAddresses,
    fetchFormData,
  };
};
