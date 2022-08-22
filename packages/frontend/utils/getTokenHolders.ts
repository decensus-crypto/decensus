const PAGE_SIZE = 500; // Max is 500 for reservoir

export const getHolders = async (token_address: string) => {
  let records: string[] = [];
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
    }
  }

  return records;
};

const reqHolders = async (token_address: string, offset: number) => {
  const url = `https://api.reservoir.tools/owners/v1?collection=${token_address}&offset=${offset}&limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  const data = await res.json();

  return data as { address: string }[];
};
