import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const contract = await ethers.deployContract("KesimpulanNFT", [deployer.address]);

  await contract.waitForDeployment();

  console.log("KesimpulanNFT deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
