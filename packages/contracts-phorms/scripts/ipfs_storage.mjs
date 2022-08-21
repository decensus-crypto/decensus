import { create } from 'ipfs-http-client';
import fetch from 'node-fetch';

const client = create('https://ipfs.infura.io:5001/api/v0')



export async function storeJsonInIPFS(obj) {
    const added = await client.add(obj);
    return added;
}

export async function getJsonFromIPFS(path) {
    // get IPFS content given an IPFS path (CID)
    const stored_obj_url = `https://ipfs.io/ipfs/${path}`;
    const response = await fetch(stored_obj_url);
    const data = await response.json();
    return data;
}

// how to use
const profiles = [
    {
        name: 'Jane Doe',
        'favorite-game': 'Stardew Valley',
        subscriber: false
    },
    {
        name: 'John Doe',
        'favorite-game': 'Dragon Quest XI',
        subscriber: true
    }
];

// module.exports = { storeJsonInIPFS, getJsonFromIPFS };

// console.log(JSON.stringify(profiles));

// const store_res = await storeJsonInIPFS(JSON.stringify(profiles));
// const store_res_url = `https://ipfs.io/ipfs/${store_res["path"]}`;
// console.log("Object stored at", store_res_url);

// const retrieve_res = await getJsonFromIPFS(store_res["path"]);
// console.log(retrieve_res);