import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

console.log("=== Deploy script start ===");

async function main() {
  const pk = process.env.PRIVATE_KEY || "";
  console.log("PK length:", pk.length, "starts0x:", pk.startsWith("0x"));
  console.log("RPC URL:", process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org");

  const network = await ethers.provider.getNetwork();
  console.log("Connected chain:", network.chainId.toString(), network.name ?? "");

  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signer found. Set PRIVATE_KEY in .env");
  }

  const [deployer] = signers;
  console.log("Deploying with:", deployer.address);

  const contract = await ethers.deployContract("KesimpulanNFT", [deployer.address]);

  await contract.waitForDeployment();

  const deployedAddress = await contract.getAddress();
  console.log("KesimpulanNFT deployed to:", deployedAddress);

  // Persist output so we can read even if stdout is hidden by runner
  const outPath = path.join(process.cwd(), "deployment-output.json");
  const payload = {
    address: deployedAddress,
    network: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log("Saved deployment info to", outPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
