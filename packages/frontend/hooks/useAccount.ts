import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { atom, useAtom } from "jotai";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { useCallback, useMemo } from "react";
import { CHAIN_ID } from "../constants/constants";

const accountAtom = atom<string | null>(null);
const providerAtom = atom<any | null>(null);
const chainIdAtom = atom<number | null>(null);

export const useAccount = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [provider, setProvider] = useAtom(providerAtom);
  const [chainId, setChainId] = useAtom(chainIdAtom);

  const connectWallet = useCallback(async () => {
    try {
      const { web3: provider, account } = await LitJsSdk.connectWeb3();
      const { chainId } = await provider.getNetwork();

      setAccount(account.toLowerCase());
      setProvider(provider);
      setChainId(chainId);
    } catch (error) {
      console.error(error);
    }
  }, [setAccount, setChainId, setProvider]);

  const getDidProvider = useCallback(async () => {
    if (!account || !provider) return;

    const threeId = new ThreeIdConnect();
    await threeId.connect(new EthereumAuthProvider(provider.provider, account));
    return threeId.getDidProvider();
  }, [account, provider]);

  const isWrongChain = useMemo(
    () => !!account && chainId !== CHAIN_ID,
    [account, chainId]
  );

  return {
    getDidProvider,
    connectWallet,
    account,
    provider,
    chainId,
    isWrongChain,
  };
};
