import { ethers } from "ethers";
import { SUBMISSION_MARK_CONTRACT_ADDRESS } from "../constants/constants";
import ABI from "../constants/submissionMarkAbi.json";
import { createToast } from "./createToast";
import { getSigner } from "./getSigner";

export const getSubmissionMarkContract = (): ethers.Contract | null => {
  try {
    const signer = getSigner();
    if (!signer) throw new Error();

    const contract = new ethers.Contract(
      SUBMISSION_MARK_CONTRACT_ADDRESS,
      ABI,
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
