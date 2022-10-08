import { promises } from "fs";
import { resolve } from "path";
import { Contract } from "@ethersproject/contracts";

import { Abi } from "./abis";
import { Chain } from "./chain";
import { toPascal } from "./changeCase";

const DEPLOYMENTS_FOLDER = resolve(__dirname, "..", "deployments");

export interface ContractDeployment {
  signer: string;
  address: string;
  chain: Chain;
  abi: Abi;
  contractInterface: Contract["interface"];
  deployed: Contract;
}

export function getDeployment({ chain, name }: { chain: Chain; name: string }): ContractDeployment {
  return require(resolve(DEPLOYMENTS_FOLDER, toPascal(name), chain, `${toPascal(name)}.json`));
}

export async function saveDeployment({
  name,
  deployment
}: {
  name: string;
  deployment: ContractDeployment;
}) {
  const folder = resolve(DEPLOYMENTS_FOLDER,  deployment.chain, toPascal(name));
  try {
    await promises.mkdir(folder, { recursive: true });
  } catch (err) {
    // no-op if folders exist
  }

  const stringified = JSON.stringify(deployment);

  await promises.writeFile(resolve(folder, `${name}.json`), stringified);

  const now = Date.now();
  await promises.writeFile(resolve(folder, `${now}.json`), stringified);
}
