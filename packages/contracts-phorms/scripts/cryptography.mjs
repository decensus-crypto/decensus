import ethers from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { getHolders } from './whitelist.js';
import { storeJsonInIPFS, getJsonFromIPFS } from './ipfs_storage.mjs';
import { readFile } from 'fs/promises';
const whitelistAddresses = JSON.parse(
    await readFile(
        new URL('../contracts/whitelist.json', import.meta.url)
    )
);


function getMerkleTree(addresses, hashLeaves = true) {
    const leaves = hashLeaves ? addresses.map(x => ethers.utils.keccak256(x)) : addresses;
    const merkleTree = new MerkleTree(leaves, ethers.utils.keccak256, {
        sortLeaves: true,
        sortPairs: true
    })
    return merkleTree;

}

export async function createDecentralizedMerkleTree(token_address) {
    const tokenHolders = await getHolders(token_address);
    // const token_holders = [
    //     "0x75F35FB2E4bc6034D2308e9Ba46C2ceF41427367",
    //     "0x236669e8C6292B2B6BdD6b19a3a30F5474427892",
    //     "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

    // ]
    const merkleTree = getMerkleTree(tokenHolders);
    const leaves = merkleTree.getLeaves()
    const jsonStr = MerkleTree.marshalLeaves(leaves)
    return await storeJsonInIPFS(jsonStr);
}



async function getProofForAddress(address, merkleTree) {
    const leaf = ethers.utils.keccak256(address);
    const proof = merkleTree.getProof(leaf)
    return proof;
}

export function addressInTree(address, merkleTree) {
    const leaf = ethers.utils.keccak256(address);
    const proof = merkleTree.getProof(leaf)
    const root = merkleTree.getRoot().toString('hex')
    return merkleTree.verify(proof, leaf, root)
}


async function getPublicKey(tx_hash) {
    const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mumbai.g.alchemy.com/v2/${env.process.ALCHEMY_POLYGON_MUMBAI_API_KEY}`
    );

    const tx = await provider.getTransaction(
        tx_hash
    );
    const expandedSig = {
        r: tx.r,
        s: tx.s,
        v: tx.v,
    };
    const signature = ethers.utils.joinSignature(expandedSig);
    const txData = {
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        value: tx.value,
        nonce: tx.nonce,
        data: tx.data,
        chainId: tx.chainId,
        to: tx.to,
    };
    const rsTx = await ethers.utils.resolveProperties(txData);
    const raw = ethers.utils.serializeTransaction(rsTx); // returns RLP encoded tx
    const msgHash = ethers.utils.keccak256(raw); // as specified by ECDSA
    const msgBytes = ethers.utils.arrayify(msgHash); // create binary hash
    const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature);
    const recoveredAddress = ethers.utils.recoverAddress(msgBytes, signature);

    return recoveredPubKey
};


// const ipfs_url_of_tree = await createDecentralizedMerkleTree("0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b");
// const ipfs_url_of_tree_cid = ipfs_url_of_tree["path"]

// console.log("ipfs_url_of_tree_cid", ipfs_url_of_tree_cid);


const ipfs_url_of_tree_cid = "QmVEkkRcusshwAK65KmjaEVsaLuuxZ65uTbSi9PsZL7tJ4"
let mtree_json = await getJsonFromIPFS(ipfs_url_of_tree_cid);
const leaves = MerkleTree.unmarshalLeaves(mtree_json)

const reconstructed_tree = getMerkleTree(leaves, false)
// console.log(addressInTree('0x75F35FB2E4bc6034D2308e9Ba46C2ceF41427365', reconstructed_tree))

console.log(addressInTree('0xf3fb852a7a9486201b28311ba316721f04d2690e', reconstructed_tree))
