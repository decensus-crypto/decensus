import { atom, useAtom } from "jotai";
// @ts-expect-error
import LitJsSdk from "lit-js-sdk";
import { useCallback } from "react";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
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

const encodeb64 = (uintarray: Uint8Array) => {
  const b64 = Buffer.from(uintarray).toString("base64");
  return b64;
};

const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // @ts-ignore
        reader.result.replace("data:application/octet-stream;base64,", "")
      );
    reader.readAsDataURL(blob);
  });
};

const decodeb64 = (b64String: string) => {
  return new Uint8Array(Buffer.from(b64String, "base64"));
};

export const useLit = () => {
  const [client, setClient] = useAtom(litClientAtom);
  const [authSig, setAuthSig] = useAtom(litAuthSigAtom);

  const initLitClient = useCallback(() => {
    if (client) return;

    const _client = new LitJsSdk.LitNodeClient();
    _client.connect();
    setClient(_client);
  }, [client, setClient]);

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
      addressesToAllowRead: string[];
      chain: string;
    }): Promise<{
      encryptedZipBase64: string;
      encryptedSymmKeyBase64: string;
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

      const encryptedZipBase64 = await blobToBase64(encryptedZip);
      const encryptedSymmKeyBase64 = encodeb64(encryptedSymmKey);

      return {
        encryptedZipBase64,
        encryptedSymmKeyBase64,
      };
    },
    [authSig, client]
  );

  const decryptWithLit = useCallback(
    async (params: {
      encryptedZipBase64: string;
      encryptedSymmKeyBase64: string;
      addressesToAllowRead: string[];
      chain: string;
    }): Promise<string> => {
      if (!authSig || !client) throw new Error("Lit initialization incomplete");

      const toDecrypt = uint8ArrayToString(
        decodeb64(params.encryptedSymmKeyBase64),
        "base16"
      );

      const decryptedSymmKey = await client.getEncryptionKey({
        accessControlConditions: accFromAddresses(params),
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
    [authSig, client]
  );

  return { initLitClient, getLitAuthSig, encryptWithLit, decryptWithLit };
};
