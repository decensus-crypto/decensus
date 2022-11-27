import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { createToast } from "../utils/createToast";
import { wait } from "../utils/wait";
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
    }): Promise<void> => {
      if (!account) {
        throw new Error("Cannot close survey");
      }

      const formCollectionContract = getFormCollectionContract(
        formCollectionAddress
      );
      if (!formCollectionContract) return;

      setIsClosing(true);

      createToast({
        title: "Survey close initiated",
        description: "Please wait...",
        status: "success",
      });

      try {
        const closed = await formCollectionContract.closed();
        if (closed) throw new Error("Survey already closed");

        const tx = await formCollectionContract.close();
        await tx.wait();

        await wait(3000); // wait for a few seconds for the graph to index the tx. TODO: more robust method

        createToast({
          title: "Survey successfully closed",
          status: "success",
        });
      } catch (error: any) {
        console.error(error);
        createToast({
          title: "Failed to submit answer",
          description:
            error.message || error.reason?.message || "unknown reason",
          status: "error",
        });
      } finally {
        setIsClosing(false);
      }
    },
    [account, getFormCollectionContract, setIsClosing]
  );

  return {
    isClosing,
    close,
  };
};
