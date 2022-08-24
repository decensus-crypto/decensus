import {
  getMerkleTree,
  getMerkleTreeRootHash,
  getProofForAddress,
} from "./utils/cryptography";

const address = (process.env.TEST_WALLET_ADDRESS || "").toLowerCase();

const tree = getMerkleTree([address]);

const root = getMerkleTreeRootHash(tree);

const proof = getProofForAddress(address, tree);

console.log(`Merkle tree generated for single address ${address}!`);

console.log("root:", root);

console.log("proof:", proof);
