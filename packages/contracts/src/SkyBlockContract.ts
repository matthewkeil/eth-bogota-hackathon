/* eslint-disable @typescript-eslint/ban-ts-comment */
import { providers as EtherProviders, utils as ethersUtils } from "ethers";
import { SkyBlockContract as SkyBlockContractType } from "../typechain";
import { buildContractProvider, EventMeta, SupportedProvider, decodeEvent } from "./SkyBlock.utils";

export interface SkyBlockContractServiceProps {
  address?: string;
  provider?: SupportedProvider;
}

export class SkyBlockContractService {
  #address: string;
  provider: Promise<SkyBlockContractType>;

  constructor({ address, provider }: SkyBlockContractServiceProps = {}) {
    if (!address) {
      throw new Error("address is required");
    }
    this.#address = address; //?? require("../../deployments/SkyBlockContract.json").address;

    if (provider) {
      this.provider = buildContractProvider(this.#address, provider);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.provider = (window as any).ethereum
        .request({ method: "eth_requestAccounts" })
        .then(() =>
          buildContractProvider(this.#address, new EtherProviders.Web3Provider(window.ethereum))
        );
    }
  }

  async onNominateAdmin(callback: (eventMeta: EventMeta) => void): Promise<SkyBlockContractType> {
    const provider = await this.provider;
    return provider.on("NominateAdmin", (existing, nominated) => {
      return callback(decodeEvent(existing, nominated));
    });
  }

  async onAcceptNomination(
    callback: (eventMeta: EventMeta) => void
  ): Promise<SkyBlockContractType> {
    const provider = await this.provider;
    return provider.on("AcceptNomination", (nominated, email) => {
      return callback(decodeEvent(nominated, email));
    });
  }

  async getAdmins() {
    const provider = await this.provider;
    return provider.getAdmins();
  }

  async getNominees() {
    const provider = await this.provider;
    return provider.getNominees();
  }

  async nominateAdmin(address: string) {
    const provider = await this.provider;
    return provider.nominateAdmin(address);
  }

  async acceptNomination(email: string) {
    const provider = await this.provider;
    return provider.acceptNomination(ethersUtils.formatBytes32String(email));
  }
}
