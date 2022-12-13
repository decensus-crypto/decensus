import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { createToast } from "../utils/createToast";

const PAGE_SIZE = 500; // Max is 500 for reservoir

// Resorvoir API offers caching by default (max-age: 3600 s). No extra caching is necessary.
const reqHolders = async (token_address: string, offset: number) => {
  const url = `https://api.reservoir.tools/owners/v1?collection=${token_address}&offset=${offset}&limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  const data = await res.json();

  return data.owners as { address: string }[];
};

const tokenHoldersState = atom<string[]>([]);
const isLoadingTokenHoldersState = atom<boolean>(false);

export const useTokenHolders = () => {
  const [tokenHolders, setTokenHolders] = useAtom(tokenHoldersState);
  const [isLoadingTokenHolders, setIsLoadingTokenHolders] = useAtom(isLoadingTokenHoldersState);

  const fetchHolders = useCallback(
    async (token_address: string) => {
      try {
        let records: string[] = [];
        let keepGoing = true;
        let offset = 0;
        while (keepGoing) {
          const response = await reqHolders(token_address, offset);
          const addresses = response.map((owner) => owner["address"]);
          records.push.apply(records, addresses);
          offset += PAGE_SIZE;
          // this may need to be adjusted to your api to handle the corner case where the last page size equal to PAGE_SIZE
          // if the api either errors our the next call where the offset is greater than the amount of records or returns an empty array
          // the behavior will be fine.
          if (addresses.length < PAGE_SIZE) {
            keepGoing = false;
          }

          setTokenHolders(records);
        }
      } catch (error) {
        console.error(error);
        createToast({
          title: "Failed to fetch token holders",
          status: "error",
        });
      } finally {
        setIsLoadingTokenHolders(false);
      }
    },
    [setIsLoadingTokenHolders, setTokenHolders],
  );

  return { fetchHolders, tokenHolders, isLoadingTokenHolders };
};
