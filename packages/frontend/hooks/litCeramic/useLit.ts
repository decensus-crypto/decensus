import { atom, useAtom } from "jotai";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { useCallback } from "react";
import { CHAIN_NAME } from "../../constants/constants";

const litClientAtom = atom<any | null>(null);
const litAuthSigAtom = atom<any | null>(null);

const accFromAddresses = (params: {
  addressesToAllowRead: string[];
  chain: string;
}) =>
  params.addressesToAllowRead.flatMap((a, i) => [
    ...(i === 0 ? [] : [{ operator: "or" }]),
    {
      contractAddress: "",
      standardContractType: "",
      chain: params.chain,
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: a,
      },
    },
  ]);

export const useLit = () => {
  const [client, setClient] = useAtom(litClientAtom);
  const [authSig, setAuthSig] = useAtom(litAuthSigAtom);

  const initLitClient = useCallback(() => {
    const client = new LitJsSdk.LitNodeClient();
    client.connect();
    setClient(client);
  }, [setClient]);

  const getLitAuthSig = useCallback(async () => {
    if (authSig) return;

    const _authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: CHAIN_NAME,
    });
    setAuthSig(_authSig);
  }, [authSig, setAuthSig]);

  const encryptWithLit = useCallback(
    async (params: {
      strToEncrypt: string;
      accessControlConditions: any[];
      addressesToAllowRead: string[];
      chain: string;
    }): Promise<{
      encryptedZipStr: string;
      encryptedSymmKey: string;
    }> => {
      if (!authSig || !client) throw new Error("Lit initialization incomplete");

      const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
        params.strToEncrypt
      );

      const encryptedSymmKey = await client.saveEncryptionKey({
        accessControlConditions: accFromAddresses(params),
        symmetricKey,
        authSig: authSig,
        chain: params.chain,
        permanant: true,
      });

      const decoder = new TextDecoder();
      const encryptedZipStr = decoder.decode(encryptedZip);

      return {
        encryptedZipStr,
        encryptedSymmKey,
      };
    },
    [authSig, client]
  );

  const decryptWithLit = useCallback(
    async (params: {
      encryptedZipStr: string;
      encryptedSymmKey: string;
      addressesToAllowRead: string[];
      chain: string;
    }): Promise<string> => {
      if (!authSig || !client) throw new Error("Lit initialization incomplete");

      const decryptedSymmKey = await client.getEncryptionKey({
        accessControlConditions: accFromAddresses(params),
        toDecrypt: params.encryptedSymmKey,
        chain: CHAIN_NAME,
        authSig,
      });

      // decrypt the files
      const encoder = new TextEncoder();
      const decryptedFiles = await LitJsSdk.decryptZip(
        encoder.encode(params.encryptedZipStr),
        decryptedSymmKey
      );
      const decryptedString = await decryptedFiles["string.txt"].async("text");

      return decryptedString;
    },
    [authSig, client]
  );

  return { initLitClient, getLitAuthSig, encryptWithLit, decryptWithLit };
};
