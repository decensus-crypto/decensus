import { ethers } from "ethers";
import { FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS } from "../constants/constants";
import FORM_COLLECTION_ABI from "../constants/formCollectionAbi.json";
import FORM_COLLECTION_FACTORY_ABI from "../constants/formCollectionFactoryAbi.json";

import { createToast } from "./createToast";
import { getSigner } from "./getSigner";

export const getFormCollectionFactoryContract = (): ethers.Contract | null => {
  try {
    const signer = getSigner();
    if (!signer) throw new Error("no signer");

    const contract = new ethers.Contract(
      FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS,
      FORM_COLLECTION_FACTORY_ABI,
      signer
    );

    if (!contract) throw new Error();

    return contract;
  } catch (error) {
    createToast({
      title: "Failed to get contract info",
      status: "error",
    });
  }

  return null;
};

export const getFormCollectionContract = (params: {
  address: string;
}): ethers.Contract | null => {
  try {
    const signer = getSigner();
    if (!signer) throw new Error("no signer");

    const contract = new ethers.Contract(
      params.address,
      FORM_COLLECTION_ABI,
      signer
    );

    if (!contract) throw new Error();

    return contract;
  } catch (error) {
    createToast({
      title: "Failed to get contract info",
      status: "error",
    });
  }

  return null;
};
