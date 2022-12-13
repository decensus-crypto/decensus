import { toString as uint8ArrayToString } from "uint8arrays/to-string";

export const encodeb64 = (uintarray: Uint8Array) => {
  const b64 = Buffer.from(uintarray).toString("base64");
  return b64;
};

export const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // @ts-ignore
        reader.result.replace("data:application/octet-stream;base64,", ""),
      );
    reader.readAsDataURL(blob);
  });
};

export const decodeb64 = (b64String: string) => {
  return new Uint8Array(Buffer.from(b64String, "base64"));
};

export const ab2str = (buf: ArrayBuffer) => {
  // @ts-expect-error
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const str2ab = (str: string) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export { uint8ArrayToString };
