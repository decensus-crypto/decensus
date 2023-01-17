import { IPFS_GATEWAY_BASE_PATH } from "../constants/constants";

export const loadJsonFromIpfs = async <T>(uri: string): Promise<T> => {
  const cid = cidFromIpfsUri(uri);
  const response = await fetch(`${IPFS_GATEWAY_BASE_PATH}${cid}`);
  const data = await response.json();
  return data;
};

const cidFromIpfsUri = (uri: string): string => {
  if (uri.slice(0, 7) !== "ipfs://") throw new Error("storage other than IPFS is not supported");
  return uri.split("//").slice(-1)[0];
};
