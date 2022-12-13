// ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

import { ab2str, str2ab } from "./dataConverters";

const ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

// Maximum message length is limited to ~446 bytes by the algorithm.
const ENCRYPTION_TEXT_CHUNK_SIZE = 400;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const genKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(ALGORITHM, true, ["encrypt", "decrypt"]);

  const [publicKey, privateKey] = await Promise.all([
    publicKeyToStr(keyPair.publicKey),
    privateKeyToStr(keyPair.privateKey),
  ]);

  return {
    publicKey,
    privateKey,
  };
};

export const encrypt = async ({ text, key }: { text: string; key: string }) => {
  const encoded = encoder.encode(text);
  const numChunks = Math.ceil(encoded.length / ENCRYPTION_TEXT_CHUNK_SIZE);

  const _encrypt = async (chunk: Uint8Array) => {
    const _key = await strToPublicKey(key);
    const encrypted = await window.crypto.subtle.encrypt(ALGORITHM, _key, chunk);

    return btoa(ab2str(encrypted));
  };

  const encryptedChunks = await Promise.all(
    [...Array(numChunks)].map((_, i) => {
      const chunk = encoded.slice(
        i * ENCRYPTION_TEXT_CHUNK_SIZE,
        (i + 1) * ENCRYPTION_TEXT_CHUNK_SIZE,
      );

      return _encrypt(chunk);
    }),
  );

  return encryptedChunks.join(".");
};

export const decrypt = async ({ encrypted, key }: { encrypted: string; key: string }) => {
  const _key = await strToPrivateKey(key);

  const chunks = encrypted.split(".").map((a) => str2ab(atob(a)));

  const _decrypt = async (chunk: ArrayBuffer) => {
    return await window.crypto.subtle.decrypt(ALGORITHM, _key, chunk);
  };

  const decryptedChunks = await Promise.all(chunks.map(_decrypt));
  const totalLength = decryptedChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const decrypted = new Uint8Array(totalLength);
  let offset = 0;
  decryptedChunks.forEach((chunk) => {
    decrypted.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  });

  return decoder.decode(decrypted);
};

const publicKeyToStr = async (key: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  return ab2str(exported);
};

const strToPublicKey = async (str: string) => {
  const binaryDer = str2ab(str);

  return await window.crypto.subtle.importKey("spki", binaryDer, ALGORITHM, true, ["encrypt"]);
};

const privateKeyToStr = async (key: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  return ab2str(exported);
};

const strToPrivateKey = async (str: string) => {
  const binaryDer = str2ab(str);

  return await window.crypto.subtle.importKey("pkcs8", binaryDer, ALGORITHM, true, ["decrypt"]);
};
