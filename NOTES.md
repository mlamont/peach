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

# Notes for an actual README

- SRC: https://scsfg.io/developers/documentation/
- start w/ a prob description, why it matters, how the system seeks to solve it
- then: components and their role in the system
- then: interactions and controls between components
  - cross-contract dependencies (how biz logic is distributed across SCs)
  - system controls
    - roles: authorized actions & administrative capabilities
    - onchain, e.g., what actions a specific role or authorized party can perform in the system and at what time
    - offchain, e.g., which party owns private keys to an authorized address, how private keys are secured, or what the specific configuration of a DAO or multisig setup is
  - event logging (SC's primary means for signaling its state to external entities)
    - what the event means
    - how it should be consumed by offchain software
  - invariants (most biz logic is modeled after a set of properties that must always hold true)
    - can guide test suites & manual code reviews
- then: how to install the system's dependencies
- then: production deployment steps
- then: contribution procedure

  - how folks can PR
  - bug bounty program
  - audits conducted

- SRC: https://github.com/RichardLitt/standard-readme/blob/main/spec.md
- section: Title
  - match repository, folder and package manager names
  - explain non-matches in Long Description
- section: Short Description
  - < 120 characters
  - match the description in the packager manager's description field
  - match GitHub's description (if on GitHub)
- section: Long Description
  - main reasons for building the repo
  - describe your module in broad terms, generally in just a few paragraphs
  - someone who's slightly familiar with your module should be able to refresh their memory without hitting "page down"
- section: Install
  - code blocks demo'g how to install
  - sub-section: dependencies
- section: Usage
  - code blocks indicating common usage / importing
- section: Contributing
  - whether PRs can be accepted (link to GH issues?)
  - where ppl can ask questions
- section: License
  - State license full name or identifier, as listed on the SPDX license list. And state license owner

# Notes for internal documentation

- start with "///" or "/\*\*"
- add comments before:
  - contract: title, author, notice, dev
  - function: notice, dev, param, return
  - public state var: notice, dev, return
  - event: notice, dev, param
- param: 1 per param
- return: 1 per return
- notice: Explain to an end user what this does
- dev: Explain to a developer any extra details

  /// @notice Get the number of tokens which can still be minted.
  /// @return count The max number of additional NFTs that can be minted by this collection.
  function numberOfTokensAvailableToMint() external view returns (uint256 count) {
  // Mint ensures that latestTokenId is always <= maxTokenId
  unchecked {
  count = maxTokenId - latestTokenId;
  }
  }

# gas optimization notes

/ name size limit: 25 is arbitrary... do 32: matches (honors) tech limit: 32 bytes.
/ revert ASAP (prevents unnecessary gas usage)
/ if a 'public' function is not to be called by the contract, make it 'external'
/ use 'external' if appropriate (won't be called internally); param loc'n is forced to be 'calldata'
/ store array length as a var, i/o always looking it up in a for-loop
/ ++i is cheaper (!)
/ don't initialize to default values
/ combine loops where possible
/ "<" uses less gas than "<="
/ cache in a local var i/o reading a state var multiple times from a f'n
/ abi.encodePacked() > abi.encode()
/ Multiplication/division by two should use bit shifting
/ use \_burn() to get a gas refund
/ Using > 0 costs more gas than != 0 when used on a uint in a require() statement.
/ do: if(x) or if(!x), i/o: if(x == true) or if(x == false)
/ for better data packing, specify var for array: unit8[] > uint[].
/ pre-calc't static values, i.e., init'l'z variables to a static value ("0x23f..."), not to a calculated value (keccak256(...)).
/ if a variable is only ever gonna be a constant, then just make it a constant (...an immutable?).
/ if simple: implement locally > use library

- mapping > array.
- aim for fixed-length arrays if know the length of an array
- if simple: implement locally > use library

- Expressions for constant values such as a call to keccak256(), should use immutable rather than constant.
- skip declaring temp/intermediate variables.
- reduce functions calling other functions.
  - calling a function once? then inline its code in the calling function! This reduces # of functions.
- reduce multiple changes to state variables: have a temp var go thru the changes, then give to state var when done
- higher # of runs by optimizer: higher deployment cost & lower runtime cost
- Reading from storage costs 200 per SLOAD instruction, and writing to storage costs 5000 gas, but reading from memory and writing to memory costs only 3 gas.
- if overflow/underflow ain't possible, use unchecked{} block
  ≈- Using 'memory' requires copying it from 'calldata' (extra!), but then y'could mutate it (unlike calldata!).
- if can, use bytes32 (fixed, 20% gas) i/o string (unbounded)
- use libraries (an example of splitting contracts) to reduce deployment cost
  - LU how to use a library to save on gas
- shorten the strings of error messages
  - require/revert strings: be less than 32 bytes
- INV using functions instead of modifiers
