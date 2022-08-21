const axios = require('axios').default;

const PAGE_SIZE = 500; // Max is 500 for reservoir

async function getHolders(token_address) {
    let records = [];
    let keepGoing = true;
    let offset = 0;
    while (keepGoing) {
        const response = await reqHolders(token_address, offset);
        const addresses = response.map((owner) => owner["address"]);
        records.push.apply(records, addresses);
        offset += PAGE_SIZE;
        // this may need to be adjusted to your api to handle the corner case where the last page size equal to PAGE_SIZE
        // if the api either errors our the next call where the offset is greater than the amount of records or returns an empty array
        // the behavior will be fine.
        if (addresses.length < PAGE_SIZE) {
            keepGoing = false;
            //console.log(records);
            return records;
        }
    }
}

async function reqHolders(token_address, offset) {
    const url = `https://api.reservoir.tools/owners/v1?collection=${token_address}&offset=${offset}&limit=${PAGE_SIZE}`;
    const params = {}
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }


    let response = await axios.get(url, params, config).then((res) => {
        // console.log("RESPONSE RECEIVED: ", res.data['owners']);
        return res.data['owners'];
    })
        .catch((err) => {
            console.log("AXIOS ERROR: ", err);
        })

    return response;
}

// how to use:
// const ded = getHolders("0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b");
// ded.then((res) => { console.log(res); })


module.exports = { getHolders };
