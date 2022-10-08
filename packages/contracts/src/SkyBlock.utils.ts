import { Contract, providers as EtherProviders, utils as ethersUtils } from "ethers";
import { SkyBlockContract__factory, SkyBlockContract as SkyBlockContractType } from "../typechain";

export type SupportedProvider =
  | EtherProviders.Web3Provider
  | EtherProviders.JsonRpcSigner
  | EtherProviders.JsonRpcProvider;

export function buildContractProvider(address: string, provider: SupportedProvider) {
  return Promise.resolve(
    new Contract(address, SkyBlockContract__factory.abi, provider) as SkyBlockContractType
  );
}

export function isAddress(input: unknown) {
  try {
    ethersUtils.getAddress(`${input}`);
  } catch {
    return false;
  }
  return true;
}

export interface EventMeta {
  nominated: string;
  existing?: string;
  email?: string;
}

export function decodeEvent(
  admin: string,
  nominatedOrEmail: string | ethersUtils.BytesLike
): EventMeta {
  if (isAddress(nominatedOrEmail)) {
    return {
      existing: admin,
      nominated: nominatedOrEmail as string
    };
  }

  return {
    nominated: admin,
    email: ethersUtils.parseBytes32String(nominatedOrEmail)
  };
}

export function encodeArgsForSolidity({ nominated, email, existing }: EventMeta) {
  if (email) {
    return [nominated, ethersUtils.formatBytes32String(email)];
  }
  return [existing, nominated];
}
