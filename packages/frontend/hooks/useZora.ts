import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
};
const args = {
  endPoint: "https://api.zora.co/graphql",
  networks: [networkInfo],
  includeFullDetails: true,
};
const zdk = new ZDK(args);

const nftNameAtom = atom<string | null>(null);
const isNftNameLoadingAtom = atom<boolean>(false);

export const useZora = () => {
  const [nftName, setNftName] = useAtom(nftNameAtom);
  const [isNftNameLoading, setIsNftNameLoading] = useAtom(isNftNameLoadingAtom);

  const fetchNftName = useCallback(
    async (nftAddress: string) => {
      try {
        setIsNftNameLoading(true);
        const resp = await zdk.collection({
          address: nftAddress,
          includeFullDetails: true,
        });
        setNftName(resp.name || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsNftNameLoading(false);
      }
    },
    [setNftName, setIsNftNameLoading]
  );
  return {
    nftName,
    isNftNameLoading,
    setNftName,
    setIsNftNameLoading,
    fetchNftName,
  };
};
