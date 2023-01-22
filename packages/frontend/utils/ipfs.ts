export const buildIpfsUri = ({ cid, path }: { cid: string; path: string }): string =>
  `ipfs://${cid}/${path}`;

export const loadJsonFromIpfs = async <T>(uri: string): Promise<T> => {
  const gatewayUri = buildGatewayUri(uri);
  const response = await fetch(gatewayUri);
  const data = await response.json();
  return data;
};

const buildGatewayUri = (ipfsUri: string): string => {
  if (ipfsUri.slice(0, 7) !== "ipfs://")
    throw new Error("storage other than IPFS is not supported");
  const uriParts = ipfsUri.split("//").slice(-1)[0].split("/");

  const cid = uriParts[0];
  const path = uriParts.slice(1).join("/");

  return `https://${cid}.ipfs.w3s.link/${path}`;
};
