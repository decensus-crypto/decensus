import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";
import {
  TEST_NFT_CONTRACT_ADDRESS,
  ZORA_DEMO_NFT_ADDRESS,
} from "../constants/constants";

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Mainnet,
};
const args = {
  endPoint: "https://api.zora.co/graphql",
  networks: [networkInfo],
  includeFullDetails: true,
};
const zdk = new ZDK(args);

// because Zora API cannot be used in Goerli, we use Blitzmap for our demo.
const nftAddressForDemo = (nftAddress: string) =>
  nftAddress === TEST_NFT_CONTRACT_ADDRESS ? ZORA_DEMO_NFT_ADDRESS : nftAddress;

export const fetchNftAggregationStats = async (nftAddress: string) => {
  return await zdk.collectionStatsAggregate({
    collectionAddress: nftAddressForDemo(nftAddress),
    network: networkInfo,
  });
};

export const fetchNftBaseInfo = async (nftAddress: string) => {
  return await zdk.collection({
    address: nftAddressForDemo(nftAddress),
    includeFullDetails: true,
  });
};

export const fetchSampleToken = async (nftAddress: string) => {
  return await zdk.tokens({
    where: {
      collectionAddresses: [nftAddressForDemo(nftAddress)],
    },
    pagination: { limit: 1 },
    includeFullDetails: false,
    includeSalesHistory: false,
  });
};
