import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org", // dari Alchemy/Infura/dll
      chainId: 8453,
      // Hardhat expects raw 32-byte hex without 0x prefix; strip if user includes it.
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY.replace(/^0x/, "")]
        : [],
    },
  },
};

export default config;
