import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { atom, useAtom } from "jotai";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { useCallback } from "react";

const accountAtom = atom<string | null>(null);
const web3Atom = atom<any | null>(null);

export const useAccount = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [web3, setWeb3] = useAtom(web3Atom);

  const connectWallet = useCallback(async () => {
    const { web3, account } = await LitJsSdk.connectWeb3();
    setAccount(account);
    setWeb3(web3);
  }, [setAccount, setWeb3]);

  const getDidProvider = useCallback(async () => {
    if (!account || !web3) return;

    const threeId = new ThreeIdConnect();
    await threeId.connect(new EthereumAuthProvider(web3.provider, account));
    return threeId.getDidProvider();
  }, [account, web3]);

  return { getDidProvider, connectWallet, account, web3 };
};
