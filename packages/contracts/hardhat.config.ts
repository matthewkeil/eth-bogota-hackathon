import "dotenv/config";
import { resolve } from "path";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./test/hardhatTsJestPlugin";

const CONTRACT_NAME = "TrustedResourcesContract";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("deployContract", "runs lib/deployContract", async () => {
  const { deployContract } = await import("./lib/deployContract");
  return deployContract(CONTRACT_NAME);
});

const infuraPath = `${process.env.INFURA_ETH_ENDPOINT_VERSION}/${process.env.INFURA_ETH_PROJECT_ID}`;

const accounts = [
  `${process.env.DEV_PRIVATE_KEY}`,
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  "7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  "47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
  "8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  "92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
  "4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
  "dbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
  "2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"
];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5
      }
    }
  },
  paths: {
    sources: resolve(__dirname, "src"),
    tests: resolve(__dirname, "src"),
    artifacts: resolve(__dirname, "dist/artifacts"),
    cache: resolve(__dirname, "dist", "cache")
  },

  typechain: {
    outDir: resolve(__dirname, "typechain")
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000,
      accounts: accounts.map((privateKey) => ({ privateKey, balance: "100000000000000000000" }))
    },
    localhost: {
      chainId: 1337,
      gas: 2100000,
      gasPrice: 8000000000,
      accounts: accounts.map((privateKey) => privateKey) // ({ privateKey, balance: "100000000000000000000" }))
    },
    goerli: {
      url: `https://goerli.infura.io/${infuraPath}`,
      accounts: accounts
    },
  },
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD"
  // },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
