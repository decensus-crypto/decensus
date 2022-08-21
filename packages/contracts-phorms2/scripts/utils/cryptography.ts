import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";

export const getMerkleTree = (addresses: string[], hashLeaves = true) => {
  const leaves = hashLeaves ? addresses.map(ethers.utils.keccak256) : addresses;

  const merkleTree = new MerkleTree(leaves, ethers.utils.keccak256, {
    sortLeaves: true,
    sortPairs: true,
  });
  return merkleTree;
};

// export const createDecentralizedMerkleTree = async (addresses: string[]) => {
//   const merkleTree = getMerkleTree(addresses);
//   const leaves = merkleTree.getLeaves();
//   const jsonStr = MerkleTree.marshalLeaves(leaves);
//   return await storeJsonInIPFS(jsonStr);
// };

export const getProofForAddress = (address: string, merkleTree: MerkleTree) => {
  const leaf = ethers.utils.keccak256(address);
  const proof = merkleTree.getHexProof(leaf);
  return proof;
};

export const isAddressInTree = (address: string, merkleTree: MerkleTree) => {
  const leaf = ethers.utils.keccak256(address);
  const proof = merkleTree.getProof(leaf);
  const root = merkleTree.getRoot().toString("hex");
  return merkleTree.verify(proof, leaf, root);
};

export const getMerkleTreeRootHash = (merkleTree: MerkleTree) => {
  const rootHash = "0x" + merkleTree.getRoot().toString("hex");
  return rootHash;
};
