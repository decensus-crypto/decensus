import { atom, useAtom } from "jotai";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { useCallback } from "react";
import { CHAIN_NAME, LIT_CHAIN } from "../../constants/constants";
import {
  blobToBase64,
  decodeb64,
  encodeb64,
  uint8ArrayToString,
} from "../../utils/dataConverters";
import { useAccount } from "../useAccount";

const litClientAtom = atom<any | null>(null);
const litAuthSigAtom = atom<any | null>(null);

const accFromAddresses = (params: { addressesToAllowRead: string[] }) =>
  params.addressesToAllowRead.flatMap((a, i) => [
    ...(i === 0 ? [] : [{ operator: "or" }]),
    {
      contractAddress: "",
      standardContractType: "",
      chain: LIT_CHAIN,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: a,
      },
    },
  ]);

const accFromNftAddress = (params: { nftAddress: string }) => [
  {
    contractAddress: params.nftAddress,
    standardContractType: "ERC721",
    chain: LIT_CHAIN,
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

export const useLit = () => {
  const [client, setClient] = useAtom(litClientAtom);
  const [authSig, setAuthSig] = useAtom(litAuthSigAtom);
  const { account, isWrongChain } = useAccount();

  const initLitClient = useCallback(async () => {
    if (client) return;

    const _client = new LitJsSdk.LitNodeClient();
    await _client.connect();
    setClient(_client);
  }, [client, setClient]);

  const getLitAuthSig = useCallback(async () => {
    if (authSig || !account || isWrongChain) return;

    try {
      const _authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: CHAIN_NAME,
      });
      setAuthSig(_authSig);
      return _authSig;
    } catch (error) {
      console.error(error);
    }
  }, [account, authSig, isWrongChain, setAuthSig]);

  const encryptWithLit = useCallback(
    async (params: {
      strToEncrypt: string;
      addressesToAllowRead?: string[];
      nftAddressToAllowRead?: string;
      chain: string;
      authSig?: any; // input auth sig explicitly in case the stored auth sig is null due to rendering behavior
    }): Promise<{
      encryptedZipBase64: string;
      encryptedSymmKeyBase64: string;
    }> => {
      if ((!authSig && !params.authSig) || !client || isWrongChain)
        throw new Error("Lit initialization incomplete");

      if (!params.addressesToAllowRead && !params.nftAddressToAllowRead)
        throw new Error(
          "Allowed wallet addresses or NFT address is not specified in Lit encyrption"
        );

      const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
        params.strToEncrypt
      );

      const acc = params.nftAddressToAllowRead
        ? accFromNftAddress({ nftAddress: params.nftAddressToAllowRead || "" })
        : accFromAddresses({
            addressesToAllowRead: params.addressesToAllowRead || [],
          });

      const encryptedSymmKey = await client.saveEncryptionKey({
        accessControlConditions: acc,
        symmetricKey,
        authSig: authSig || params.authSig,
        chain: params.chain,
        permanant: true,
      });

      const encryptedZipBase64 = await blobToBase64(encryptedZip);
      const encryptedSymmKeyBase64 = encodeb64(encryptedSymmKey);

      return {
        encryptedZipBase64,
        encryptedSymmKeyBase64,
      };
    },
    [authSig, client, isWrongChain]
  );

  const decryptWithLit = useCallback(
    async (params: {
      encryptedZipBase64: string;
      encryptedSymmKeyBase64: string;
      addressesToAllowRead?: string[];
      nftAddressToAllowRead?: string;
      chain: string;
    }): Promise<string> => {
      if (!authSig || !client || isWrongChain)
        throw new Error("Lit initialization incomplete");

      if (!params.addressesToAllowRead && !params.nftAddressToAllowRead)
        throw new Error(
          "Allowed wallet addresses or NFT address is not specified in Lit encyrption"
        );

      const toDecrypt = uint8ArrayToString(
        decodeb64(params.encryptedSymmKeyBase64),
        "base16"
      );

      const acc = params.nftAddressToAllowRead
        ? accFromNftAddress({ nftAddress: params.nftAddressToAllowRead || "" })
        : accFromAddresses({
            addressesToAllowRead: params.addressesToAllowRead || [],
          });

      const decryptedSymmKey = await client.getEncryptionKey({
        accessControlConditions: acc,
        toDecrypt,
        chain: CHAIN_NAME,
        authSig,
      });

      // decrypt the files
      const decryptedFiles = await LitJsSdk.decryptZip(
        new Blob([decodeb64(params.encryptedZipBase64)]),
        decryptedSymmKey
      );
      const decryptedString = await decryptedFiles["string.txt"].async("text");

      return decryptedString;
    },
    [authSig, client, isWrongChain]
  );

  return {
    initLitClient,
    getLitAuthSig,
    encryptWithLit,
    decryptWithLit,
    isLitClientReady: !!client,
    litAuthSig: authSig,
  };
};
