import { ethers } from "ethers";
import { FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS } from "../constants/constants";
import FORM_COLLECTION_ABI from "../constants/formCollectionAbi.json";
import FORM_COLLECTION_FACTORY_ABI from "../constants/formCollectionFactoryAbi.json";

import { createToast } from "./createToast";
import { getSigner } from "./getSigner";

export const getFormCollectionFactoryContract = (params: {
  readonly?: boolean;
}): ethers.Contract | null => {
  try {
    let signer: ethers.Signer | undefined = undefined;
    if (!params.readonly) {
      signer = getSigner() || undefined;
      if (!signer) throw new Error();
    }

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
  readonly?: boolean;
}): ethers.Contract | null => {
  try {
    let signer: ethers.Signer | undefined = undefined;
    if (!params.readonly) {
      signer = getSigner() || undefined;
      if (!signer) throw new Error();
    }

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
