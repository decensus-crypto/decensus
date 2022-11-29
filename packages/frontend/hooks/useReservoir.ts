import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const PAGE_SIZE = 500; // Max is 500 for reservoir

const holdersAtom = atom<string[]>([]);
const isLoadingHoldersAtom = atom<boolean>(false);

export const useReservoir = () => {
  const [holders, setHolders] = useAtom(holdersAtom);
  const [isLoadingHolders, setIsLoadingHolders] = useAtom(isLoadingHoldersAtom);

  const reqHolders = async (nftAddress: string, offset: number) => {
    const url = `https://api.reservoir.tools/owners/v1?collection=${nftAddress}&offset=${offset}&limit=${PAGE_SIZE}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.owners as { address: string }[];
  };

  const fetchHolders = useCallback(
    async (nftAddress: string) => {
      if (isLoadingHolders) return;
      try {
        setIsLoadingHolders(true);

        let records: string[] = [];
        let keepGoing = true;
        let offset = 0;
        while (keepGoing) {
          const response = await reqHolders(nftAddress, offset);
          const addresses = response.map((owner) => owner["address"]);
          records.push.apply(records, addresses);
          offset += PAGE_SIZE;
          // this may need to be adjusted to your api to handle the corner case where the last page size equal to PAGE_SIZE
          // if the api either errors our the next call where the offset is greater than the amount of records or returns an empty array
          // the behavior will be fine.
          if (addresses.length < PAGE_SIZE) {
            keepGoing = false;
          }
        }
        setHolders(records);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingHolders(false);
      }
    },
    [setHolders, setIsLoadingHolders]
  );
  return { holders, isLoadingHolders, setHolders, fetchHolders };
};
