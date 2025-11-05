# Notes on an actual README

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

# Title

- match repository, folder and package manager names
- explain non-matches in Long Description

# Short Description

- < 120 characters
- match the description in the packager manager's description field
- match GitHub's description (if on GitHub)

# Long Description

- main reasons for building the repo
- describe your module in broad terms, generally in just a few paragraphs
- someone who's slightly familiar with your module should be able to refresh their memory without hitting "page down"
- start w/ a prob description, why it matters, how the system seeks to solve it
- then: components and their role in the system
- then: interactions and controls between components (cross-contract dependencies, system controls, event logging, invariants)

# Install

- code blocks demo'g how to install
- sub-section: dependencies (and how to install 'em)
- production deployment

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
