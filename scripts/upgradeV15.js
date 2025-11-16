const { ethers, upgrades } = require("hardhat");
async function main() {
  const PeachLatest = await ethers.getContractFactory("PeachV15");
  console.log("Upgrading Peach...");

  await upgrades.upgradeProxy(
    "0xB4f84Adc5D37BC802d7A423d20f3ce54666BFc9d",
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
