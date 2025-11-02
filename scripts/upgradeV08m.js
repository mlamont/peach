const { ethers, upgrades } = require("hardhat");
async function main() {
  const PeachLatest = await ethers.getContractFactory("PeachV08");
  console.log("Upgrading Peach...");

  await upgrades.upgradeProxy(
    "0x07C497dAbC04Fe457cB1876EA91853cE4C6496E8",
    PeachLatest
  );
  console.log("Peach upgraded"); /// PPP address remains
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
