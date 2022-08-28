import { ethers } from "ethers";
import { useCallback } from "react";
import { FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS } from "../constants/constants";
import FORM_COLLECTION_ABI from "../constants/formCollectionAbi.json";
import FORM_COLLECTION_FACTORY_ABI from "../constants/formCollectionFactoryAbi.json";
import { createToast } from "../utils/createToast";

import { useAccount } from "./useAccount";

export const useContracts = () => {
  const { provider, account } = useAccount();

  const getFormCollectionFactoryContract = useCallback(() => {
    if (!account || !provider) return null;

    try {
      const signer = provider.getSigner(account);

      if (!signer) return null;

      const contract = new ethers.Contract(
        FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS,
        FORM_COLLECTION_FACTORY_ABI,
        signer
      );

      return contract;
    } catch (error) {
      console.error(error);
      createToast({
        title: "Failed to get form collection factory contract info",
        status: "error",
      });
      return null;
    }
  }, [account, provider]);

  const getFormCollectionContract = useCallback(
    (address: string) => {
      if (!account || !provider) return null;

      try {
        const signer = provider.getSigner(account);
        if (!signer) return null;

        const contract = new ethers.Contract(
          address,
          FORM_COLLECTION_ABI,
          signer
        );

        return contract;
      } catch (error) {
        console.error(error);
        createToast({
          title: "Failed to get form collection contract info",
          status: "error",
        });
        return null;
      }
    },
    [account, provider]
  );

  return { getFormCollectionFactoryContract, getFormCollectionContract };
};
