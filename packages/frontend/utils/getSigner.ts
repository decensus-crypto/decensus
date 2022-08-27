import { ethers } from "ethers";
import { createToast } from "./createToast";

export const getSigner = (account: string): ethers.Signer | null => {
  try {
    const { ethereum } = window;
    if (!ethereum) return null;

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner(account);

    return signer;
  } catch (error) {
    createToast({
      title: "Failed to get contract signer",
      status: "error",
    });
  }

  return null;
};
