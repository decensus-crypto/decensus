import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { atom, useAtom } from "jotai";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { useCallback } from "react";
import { CHAIN_ID } from "../constants/constants";

const accountAtom = atom<string | null>(null);
const providerAtom = atom<any | null>(null);

export const useAccount = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [provider, setProvider] = useAtom(providerAtom);

  const connectWallet = useCallback(async () => {
    try {
      const { web3: provider, account } = await LitJsSdk.connectWeb3({
        chainId: CHAIN_ID,
      });
      setAccount(account.toLowerCase());
      setProvider(provider);
    } catch (error) {
      console.error(error);
    }
  }, [setAccount, setProvider]);

  const getDidProvider = useCallback(async () => {
    if (!account || !provider) return;

    const threeId = new ThreeIdConnect();
    await threeId.connect(new EthereumAuthProvider(provider.provider, account));
    return threeId.getDidProvider();
  }, [account, provider]);

  return { getDidProvider, connectWallet, account, provider };
};
