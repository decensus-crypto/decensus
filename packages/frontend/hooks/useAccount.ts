import { atom, useAtom } from "jotai";
import { createToast } from "../utils/createToast";
import { getSigner } from "../utils/getSigner";

const accountAtom = atom<string | null>(null);
const isLoadingAtom = atom<boolean>(true);

export const useAccount = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const checkWallet = async () => {
    try {
      setIsLoading(true);
      const { ethereum } = window;
      if (!ethereum || !ethereum.request) return;

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (!accounts || accounts.length === 0) {
        return;
      }

      const address = await getSigner()?.getAddress();
      if (!address) throw new Error();

      setAccount(address);
    } catch (error) {
      createToast({
        title: "Failed to check account in MetaMask.",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const { ethereum } = window;
      if (!ethereum || !ethereum.request) return;

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        createToast({
          title: "No account found in MetaMask.",
          description: "Please add account",
          status: "error",
        });
        return;
      }

      const address = await getSigner()?.getAddress();
      if (!address) throw new Error();

      setAccount(address);
    } catch (error) {
      createToast({
        title: "Failed to connect wallet",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    account,
    isLoadingAccount: isLoading,
    connectWallet,
    checkWallet,
  };
};
