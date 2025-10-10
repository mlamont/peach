# OPEN QUESTIONS

- ~~Does V2 need `initialize()`?~~
  - ~~did test: making V2s w/o this f'n and see if anything breaks~~
    - _yep, to be upgrade-safe, need `initialize()`, and for it to call initializers of base contracts_
  - ~~did test: make V2 with this f'n that does something, and see if it changes state var.s~~
    - _nope, `initialize()` does not change state in v2_
- ~~How to end upgradeability?~~
  - ~~did INV: will commenting out `__UUPSUpgradeable_init()` from `initializer()` disable upgradeability?~~
    - _nope: no effect_
  - ~~did test: How about not inheriting from the proxiable parent contract?~~
    - _nope: HH prevents upgrading b/c contract deemed upgradeable-unsafe_
  - ~~abandoned test: `_authorizeUpgrade()` checks upgradeability variable, which is initialized to true, and onlyOwner settable to false~~
  - _used `StorageSlot` library to one-way-toggle a boolean slot to on (`onlyOwner` settable), returning true for `upgradeabilityEnded()`, checked in `_authorizeUpgrade()`_
- ~~Where do I find all 3 contracts, both in local & testnet blockchains?~~
  - ~~...to possibly see 3 contracts on Sepolia, I'll need HH-verify working...~~
  - ~~did test: deploy to Sepolia, w/ HHConfigJS updated~~
  - _clearly see PPP, LLL, and their verified code, post-deployment_
- ~~ So do we know the addresses of the old LLL, new LLL, and AAA???~~
- ~~How do I resolve these dependency tree issues? (HH-verify) (HH-ethers)~~
  - ~~possibly do `npm uninstall ...` then `npm install ...`~~
  - _installed earlier versions of these packages_
- ~~Where are we keeping/archiving the addresses of the old LLLs?~~
- ~~did tutorial: https://forum.openzeppelin.com/t/openzeppelin-upgrades-step-by-step-tutorial-for-hardhat/3580~~
- ~~did tutorial: https://forum.openzeppelin.com/t/uups-proxies-tutorial-solidity-javascript/7786~~
- ~~Can I repeat upgrading reliably?~~
  - ~~did tutorial: my section: summary recipe~~
    - _yes: wrote & executed LIVE RECIPE section based on experience & SUMMARY RECIPE section_
- ~~Do I need to override `proxiableUUID()` & `upgradeToAndCall()`?~~
  - ~~did INV: `proxiableUUID()` & `upgradeToAndCall()` from `@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol`~~
  - _just need to implement, and thus override, `_authorizeUpgrade()`, with no need to override any other function_
- ~~Can I change PPP ownership from the deploying HH-address?~~
  ~~- no need to test: establish onlyOwner actions, then `initialize()`: `initialize(address initialOwner)` + `__Ownable_init(initialOwner)`~~
  - _set `initialOwner` based on `ethers.getSigners()` pulling from `hardhat.config.js`_

# Other Notes

- so it looks like only the first LLL's `initialize` is run (per deployProxy), and not the subsequent LLLs' (per upgradeProxy)
  - ...they aren't run after the first, but `initialize()` needs to be there, else it'll fail HH safety check
- had to install previous versions of packages, matching those for the Orange project:
  - `npm install --save-dev @nomicfoundation/hardhat-ethers@3.1.0 ethers`
  - `npm install --save-dev @nomicfoundation/hardhat-verify@2.1.1`

# LIVE RECIPE

## set up

### set up folder: shell

```
mkdir pearsprout
cd pearsprout
npm init -y
```

### set up editor: VS Code

- open pearsprout
- copy over notes.md from previous project (pearseed)
- initialize GitHub repository, publish branch (to new & public project)

### set up packages: shell

```
npm install --save-dev hardhat@2
touch .gitignore
echo "/node_modules" >> .gitignore
npm install --save-dev @openzeppelin/hardhat-upgrades
npm install --save-dev ethers
npm install --save-dev @nomicfoundation/hardhat-ethers@3
npm install --save-dev @openzeppelin/contracts-upgradeable
npm install --save-dev @nomicfoundation/hardhat-verify@2
npm install --save-dev dotenv
npm install --save-dev @openzeppelin/contracts
npx hardhat init // Create an empty hardhat.config.js
echo "/artifacts" >> .gitignore
mkdir contracts && touch contracts/Pearsprout.sol
```

## build up

### build up code: VS Code

- copy from a previous contract & rename a few things, then save
- `npx hardhat compile`
- `echo "/cache" >> .gitignore`

### build up configuration: hardhat.config.js

- copy file from a previous project, then save
- copy .env file from a previous project, then save
- `echo ".env" >> .gitignore`

## ship out

### ship out prep: scripts/deploy.js

- `mkdir scripts`
- copy (into /scripts) deploy.js from a previous project & rename a few things, then save
- ensure Sepolia funds in deploying account (should be same as owning account)

### ship out command: shell

```
npx hardhat run --network sepolia scripts/deploy.js
echo "/.openzeppelin" >> .gitignore
```

### ship out verify: shell

```
npx hardhat verify --network sepolia PROXY_ADDRESS
```

## build again

- copy from a previous contract & rename a few things, then save
- add functionality to end upgradeability, then save
- `npx hardhat compile`

## ship again

- copy (into /scripts) upgrade.js from a previous project & rename a few things, then save
- `npx hardhat run --network sepolia scripts/upgrade.js`
- `npx hardhat verify --network sepolia PROXY_ADDRESS`

## build last

- copy, then minorly modify, previous contract, then save
- `npx hardhat compile`

## ship last

- copy, then minorly modify, previous upgrade.js, then save
- `npx hardhat run --network sepolia scripts/upgradeV3.js`
  - this should work because `upgradeabilityEnded()` returns `false` via Sepolia Etherscan
- `npx hardhat verify --network sepolia PROXY_ADDRESS`

## build dummy

- copy, then minorly modify, previous contract, then save
- `npx hardhat compile`

## ship dummy

- copy, then minorly modify, previous upgrade.js, then save
- brick upgradeability: do `endUpgradeability()` via Sepolia Etherscan
- `npx hardhat run --network sepolia scripts/upgradeV4.js`
  - this should NOT work because `upgradeabilityEnded()` returns `true` via Sepolia Etherscan
