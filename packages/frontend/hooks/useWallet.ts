import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { CHAIN_ID } from "../constants/constants";

const walletAtom = atom<string | null>(null);
const walletStatusAtom = atom<
  "connected" | "incorrect_network" | "connecting" | "disconnected"
>("disconnected");
const providerAtom = atom<any | null>(null);
const chainIdAtom = atom<number | null>(null);
const didProviderAtom = atom<any | null>(null);

export const useWallet = () => {
  const [wallet, setWallet] = useAtom(walletAtom);
  const [walletStatus, setWalletStatus] = useAtom(walletStatusAtom);
  const [provider, setProvider] = useAtom(providerAtom);
  const [chainId, setChainId] = useAtom(chainIdAtom);
  const [didProvider, setDidProvider] = useAtom(didProviderAtom);

  const connectWallet = useCallback(async () => {
    if (wallet) return;
    try {
      setWalletStatus("connecting");
      const { web3: provider, account } = await LitJsSdk.connectWeb3();
      const { chainId } = await provider.getNetwork();

      setWallet(account.toLowerCase());
      setProvider(provider);
      setChainId(chainId);
      if (chainId === CHAIN_ID) {
        setWalletStatus("connected");
      } else {
        setWalletStatus("incorrect_network");
      }
    } catch (error) {
      console.error(error);
      setWalletStatus("disconnected");
    }
  }, [setWallet, setProvider, setWalletStatus, setChainId]);

  const disconnectWallet = useCallback(async () => {
    if (!wallet) return;
    await LitJsSdk.disconnectWeb3();

    setWallet(null);
    setWalletStatus("disconnected");
    setChainId(null);
  }, [setWallet, setWalletStatus, setChainId]);

  const getDidProvider = useCallback(async () => {
    if (didProvider) return;
    if (!wallet) return;
    if (!provider) return;

    const threeId = new ThreeIdConnect();
    await threeId.connect(new EthereumAuthProvider(provider.provider, wallet));
    setDidProvider(threeId.getDidProvider());
  }, [wallet, provider, didProvider, setDidProvider]);

  return {
    wallet,
    chainId,
    walletStatus,
    provider,
    didProvider,
    connectWallet,
    disconnectWallet,
    getDidProvider,
  };
};
