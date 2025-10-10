const { ethers, upgrades } = require("hardhat");
async function main() {
  const PeachLatest = await ethers.getContractFactory("PeachV02");
  console.log("Upgrading Peach...");

  await upgrades.upgradeProxy(
    "0xaD4C3bC7fEbC9FAd50496109c4845C1826eCe6D0",
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
