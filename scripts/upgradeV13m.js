const { ethers, upgrades } = require("hardhat");
async function main() {
  const PeachLatest = await ethers.getContractFactory("PeachV13");
  console.log("Upgrading Peach...");

  await upgrades.upgradeProxy(
    "0x1A17C3096dda65a8f9C53D0F8fcB831f9F66b927",
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
