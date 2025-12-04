// Plain JS deploy using ethers v6 to avoid Hardhat runner silencing logs
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

async function main() {
  const pk = process.env.PRIVATE_KEY || "";
  const rpc = process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org";

  if (!pk) throw new Error("PRIVATE_KEY not set");

  const provider = new ethers.JsonRpcProvider(rpc, 8453);
  const wallet = new ethers.Wallet(pk.startsWith("0x") ? pk : `0x${pk}`, provider);

  console.log("Deploying from:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance (wei):", balance.toString());

  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "KesimpulanNFT.sol", "KesimpulanNFT.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy(wallet.address);
  console.log("Tx hash:", contract.deploymentTransaction().hash);

  const receipt = await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("KesimpulanNFT deployed to:", address);

  const outPath = path.join(process.cwd(), "deployment-output.json");
  fs.writeFileSync(outPath, JSON.stringify({
    address,
    network: "base",
    deployer: wallet.address,
    tx: contract.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
  }, null, 2));
  console.log("Saved deployment info to", outPath);
}

main().catch((err) => {
  console.error("Deploy error:", err);
  process.exitCode = 1;
});
