// ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

const ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const genKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(ALGORITHM, true, [
    "encrypt",
    "decrypt",
  ]);

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
  const _key = await strToPublicKey(key);
  const encrypted = await window.crypto.subtle.encrypt(
    ALGORITHM,
    _key,
    encoder.encode(text)
  );

  return ab2str(encrypted);
};

export const decrypt = async ({
  encrypted,
  key,
}: {
  encrypted: string;
  key: string;
}) => {
  const _key = await strToPrivateKey(key);
  const decrypted = await window.crypto.subtle.decrypt(
    ALGORITHM,
    _key,
    str2ab(encrypted)
  );

  return decoder.decode(decrypted);
};

const publicKeyToStr = async (key: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  return ab2str(exported);
};

const strToPublicKey = async (str: string) => {
  const binaryDer = str2ab(str);

  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    ALGORITHM,
    true,
    ["encrypt"]
  );
};

const privateKeyToStr = async (key: CryptoKey) => {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  return ab2str(exported);
};

const strToPrivateKey = async (str: string) => {
  const binaryDer = str2ab(str);

  return await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    ALGORITHM,
    true,
    ["decrypt"]
  );
};

const ab2str = (buf: ArrayBuffer) => {
  // @ts-expect-error
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const str2ab = (str: string) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
