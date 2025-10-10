const { ethers, upgrades } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  const Peach = await ethers.getContractFactory("PeachV01");
  console.log("Deploying Peach...");
  const peach = await upgrades.deployProxy(Peach, [deployer.address], {
    initializer: "initialize",
  });
  await peach.waitForDeployment();
  console.log("Peach deployed to:", await peach.getAddress()); // (PPP)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
