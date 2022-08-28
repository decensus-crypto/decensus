import { ZDK, ZDKChain, ZDKNetwork } from "@zoralabs/zdk";

//const TOKENS_PAGE_SIZE = 500;

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

export const fetchNftAggregationStats = async (nftAddress: string) => {
  return await zdk.collectionStatsAggregate({
    collectionAddress: nftAddress,
    network: networkInfo,
  });
};

export const fetchNftBaseInfo = async (nftAddress: string) => {
  return await zdk.collection({
    address: nftAddress,
    includeFullDetails: true,
  });
};

export const fetchSampleToken = async (nftAddress: string) => {
  return await zdk.tokens({
    where: {
      collectionAddresses: [nftAddress],
    },
    pagination: { limit: 1 },
    includeFullDetails: false,
    includeSalesHistory: false,
  });
};

// getting NFT owners by Zora API is very slow. We use Reservoir for now.

//export const fetchNftOwners = async (nftAddress: string) => {
//  let owners: string[] = [];
//  let after: string | undefined = undefined;
//  // set max request repeat number to 30. This is related to the rate-limit of Zora
//  // https://docs.zora.co/docs/zora-api/zdk#api-key-optional
//  for (let i = 0; i < 30; i++) {
//    const result = await _fetchNftOwners(nftAddress, after);
//    owners.push(...result.owners);
//
//    if (!result.hasNextPage) {
//      break;
//    } else {
//      after = result.after as string | undefined;
//    }
//  }
//
//  return owners.filter((o) => !!o);
//};
//
//const _fetchNftOwners = async (
//  nftAddress: string,
//  after?: string
//): Promise<{
//  owners: string[];
//  after?: string;
//  hasNextPage: boolean;
//}> => {
//  const res = await zdk.tokens({
//    where: {
//      collectionAddresses: [nftAddressForDemo(nftAddress)],
//    },
//    networks: [networkInfo],
//    includeFullDetails: false,
//    includeSalesHistory: false,
//    pagination: {
//      limit: TOKENS_PAGE_SIZE,
//      after,
//    }, // Max page size of Zora API: 500
//    sort: { sortDirection: SortDirection.Desc, sortKey: TokenSortKey.TokenId },
//  });
//
//  return {
//    owners: res.tokens.nodes.map((t) => t.token.owner || ""),
//    after: res.tokens.pageInfo.endCursor || undefined,
//    hasNextPage: res.tokens.pageInfo.hasNextPage,
//  };
//};
