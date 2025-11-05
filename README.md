# Rockopera Color

Own a color. Name that color. Make art onchain.

This is onchain art tech for onchain art work: 1 NFT color swatch for each of the 16M+ web colors.
Currently a collectible: mint for a fee, rename for free.
Intended for utility: engage composibility with other onchain art tech.
Not a problem to solve, but an opportunity to explore, enabled by Web3: natively onchain art.

# System

This is 1 webpage, hosted on IPFS, interacting with 1 smart contract (upgradeable proxy) on Ethereum (mainnet).
This has 1 admin, me, who is the owner with the rights to withdraw funds, upgrade the implementation contract, and eventually end upgradeability.
My intent is to end upgradeability once a self-determined period of sufficient learning & application has passed.
Working project title: Peach, with related project phases also being named after fruits from the Nintendo game "Animal Crossing: New Horizons".

# Install

I mean, if you want to fork this and play around, be my guest, but I anticipate my learning adventures to result in non-trivial changes over time.

## Dependencies

```
npm install --save-dev hardhat@2
npm install --save-dev @openzeppelin/hardhat-upgrades
npm install --save-dev ethers
npm install --save-dev @nomicfoundation/hardhat-ethers@3
npm install --save-dev @openzeppelin/contracts-upgradeable
npm install --save-dev @nomicfoundation/hardhat-verify@2
npm install --save-dev dotenv
npm install --save-dev @openzeppelin/contracts
```

## Deployment

Shell commands used to deploy appropriate smart contract (modify deployment script from this repo as appropriate):

```
npx hardhat compile
npx hardhat run --network mainnet scripts/DEPLOY.js
```

Shell command used to upgrade to appropriate smart contract (modify upgrade script from this repo as appropriate):

```
npx hardhat run --network mainnet scripts/UPGRADE.js
```

# Usage

IPFS webpage via Web2: https://rockoperacolor.com
IPFS webpage via Web3: https://color.rockopera.eth
Contract via Etherscan: https://etherscan.io/address/0x1a17c3096dda65a8f9c53d0f8fcb831f9f66b927#readProxyContract

# Contributing

No PRs accepted, for now.
No audits conducted, yet.
No bug bounty program, currently.

Gaps in security: unexpected, but I'll gladly receive feedback!
Gaps in functionality & quality: expected, and I intend to find & rectify 'em!

This project is a labour my learning, actively in progress.
Constructive feedback welcomed: mlamont@gmail.com
Donations welcomed: rockopera.eth

# License

MIT License
