import { ethers } from "ethers";
import {
  FORM_COLLECTION_FACTORY_CONTRACT_ADDRESS,
  SUBMISSION_MARK_CONTRACT_ADDRESS,
} from "../constants/constants";
import FORM_COLLECTION_FACTORY_ABI from "../constants/formCollectionFactoryAbi.json";
import SUBMISSION_MARK_ABI from "../constants/submissionMarkAbi.json";

import { createToast } from "./createToast";
import { getSigner } from "./getSigner";

export const getSubmissionMarkContract = (): ethers.Contract | null => {
  try {
    const signer = getSigner();
    if (!signer) throw new Error();

    const contract = new ethers.Contract(
      SUBMISSION_MARK_CONTRACT_ADDRESS,
      SUBMISSION_MARK_ABI,
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

export const getFormCollectionFactoryContract = (): ethers.Contract | null => {
  try {
    const signer = getSigner();
    if (!signer) throw new Error();

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
