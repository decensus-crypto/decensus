import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { createToast } from "../utils/createToast";
import { useAccount } from "./useAccount";
import { useContracts } from "./useContracts";

const isClosingAtom = atom<boolean>(false);

export const useCloseSurvey = () => {
  const { account } = useAccount();
  const { getFormCollectionContract } = useContracts();
  const [isClosing, setIsClosing] = useAtom(isClosingAtom);

  const close = useCallback(
    async ({
      formCollectionAddress,
    }: {
      formCollectionAddress: string;
    }): Promise<{ success: boolean } | null> => {
      if (!account) {
        throw new Error("Cannot close survey");
      }

      const formCollectionContract = getFormCollectionContract(
        formCollectionAddress
      );
      if (!formCollectionContract) return null;

      setIsClosing(true);

      createToast({
        title: "Survey close initiated",
        description: "Please wait...",
        status: "success",
      });

      try {
        const closed = await formCollectionContract.closed();
        if (closed) throw new Error("Survey already closed");

        try {
          const tx = await formCollectionContract.close();
          await tx.wait();
        } catch (error) {
          console.error(error);
          throw new Error("Error occurred during transaction");
        }

        createToast({
          title: "Survey successfully closed",
          status: "success",
        });
        setIsClosing(false);

        return { success: true };
      } catch (error: any) {
        console.error(error);
        createToast({
          title: "Failed to close survey",
          description: error.message,
          status: "error",
        });
        setIsClosing(false);
        return null;
      }
    },
    [account, getFormCollectionContract, setIsClosing]
  );

  return {
    isClosing,
    close,
  };
};
