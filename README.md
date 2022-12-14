<p align="center">
  <a href="https://decensus.centiv.xyz" target="_blank" rel="noopener noreferrer">
    <img width="300" src="./img/Logo2.png" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://github.com/decensus-crypto/app/actions/workflows/ci.yaml"><img src="https://github.com/decensus-crypto/app/actions/workflows/ci.yaml/badge.svg" alt="ci status"></a>
</p>
<br/>

# Decensus

decensus is a dapp that helps NFT projects and DAOs figuring out their community demographics.

## Contributing

All contributions are welcome!

For bugs and feature requests, please create an issue.

If you want to contribute to the codebase, please follow the steps below:

1. Fork the repository
2. Clone your fork, then develop and test your changes
3. Submit a pull request

### How to develop

This repository is a monorepo containing the following packages:

- `packages/contracts`: smart contracts
- `packages/frontend`: frontend application
- `packages/subgraph`: subgraph in [the Graph protocol](https://thegraph.com/en/) for data indexing of the contracts

After cloning the repository, run `yarn install` at the repository root to install the dependencies.

Then, run `yarn dev` at the `packages/frontend` to start the development server at `http://localhost:3000`.

For more information, please refer to the READMEs in each package.
