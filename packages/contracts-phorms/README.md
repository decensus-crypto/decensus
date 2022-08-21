# phorms.xyz

Our only backend is the blockchain (Polygon in our case). We used NFTs to structure form models. It maps as follows:  
- A Form is a customized ERC721 (NFT) collection  
- Every user that completes / answers a Form get a new NFT minted from that collection  
- Forms are created using the Forms Factory `FormCollectionFactory.sol`, which clones a predefined customized ERC721 contract (`FormCollection.sol`)  

To install the libraries needed, run `npm install`.

The normal flow of our application has 3 main steps:  
1. Deploy `FormCollectionFactory` and `FormCollection` using `npx hardhat run scripts/deploy-factory.js`
2. To create a new form run `npx hardhat run scripts/create-form.js`  
3. To submit a new form answer run `npx hardhat run scripts/mint-answer.js`   


Other commands:  
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network matic scripts/deploy-factory.js
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
