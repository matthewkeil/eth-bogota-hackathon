import { ethers } from "hardhat";

import { getAbi, ContractDeployment, saveDeployment, chains } from "../lib";

export async function deployContract(name: string, ...args: string[]) {
  const [signer] = await ethers.getSigners();
  const chainId = (await signer.getChainId()) as keyof typeof chains;
  const chain = chains[chainId];
  if (!chain) {
    throw new Error(`Unsupported chainId: ${chainId}`);
  }
  // if ((chainId === 1 || chainId === 137) && process.env.NODE_ENV !== "production") {
  //   throw new Error("Can't deploy contract on mainnet in development mode");
  // }

  const ContractFactory = await ethers.getContractFactory(name, signer);
  const contract = await ContractFactory.deploy(...args);
  console.log({ contract });
  const deployed = await contract.deployed();
  console.log({ deployed });

  const deployment: ContractDeployment = {
    abi: getAbi(name),
    chain: chain,
    signer: signer.address,
    address: deployed.address,
    contractInterface: contract.interface,
    deployed
  };

  await saveDeployment({ name, deployment });

  return deployment;
}

// export async function deployRbac() {
//   const tokens = await deployContract();
// }
