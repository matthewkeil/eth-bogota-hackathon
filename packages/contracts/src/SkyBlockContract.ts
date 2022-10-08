/* eslint-disable @typescript-eslint/ban-ts-comment */
import { providers as EtherProviders, Wallet } from "ethers";
import { SkyBlockContract__factory, SkyBlockContract as SkyBlockContractType } from "../typechain";
import deployment from "../deployments/TrustedResourcesContract.json";
import {
  buildContractProvider,
  EventMeta,
  SupportedProvider,
  decodeEvent,
  encodeArgsForSolidity
} from "./SkyBlock.utils";

function handleError(err: unknown) {
  throw err instanceof Error ? err : new Error(`${err}`);
}

export interface TrustedResourcesContractProps {
  address?: string;
  signed?: SupportedProvider;
  unsigned?: SupportedProvider;
}

export class SkyBlockContractService {
  static decodeEvent = decodeEvent;
  static encodeArgsForSolidity = encodeArgsForSolidity;

  // participantStatus = defaultParticipantStatus;
  // get canAddStep(): boolean {
  //   return this.participantStatus === "ACTIVE" || this.participantStatus === "ADMIN";
  // }

  set signedProvider(signed: SupportedProvider) {
    this.#signed = buildContractProvider(this.#address, signed);
  }
  set unsignedProvider(unsigned: SupportedProvider) {
    this.#unsigned = buildContractProvider(this.#address, unsigned);
  }

  #address: string;
  #signed?: Promise<TrustedResourcesContractType>;
  #unsigned?: Promise<TrustedResourcesContractType>;

  private get provider(): Promise<SkyBlockContractType> {
    return new Promise((resolve) => {
      if (this.#signed) {
        resolve(this.#signed);
      } else resolve(this.#unsigned as Promise<TrustedResourcesContractType>);
    });
  }

  constructor({ address, signed, unsigned }: TrustedResourcesContractProps = {}) {
    this.#address = address ?? deployment.address;

    if (unsigned) {
      this.unsignedProvider = unsigned;
    }
    if (signed) {
      this.signedProvider = signed;
    }
    if (!(this.#signed || this.#unsigned)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.#signed = (window as any).ethereum
          .request({ method: "eth_requestAccounts" })
          .then(() => {
            const provider = new EtherProviders.Web3Provider(window.ethereum);
            const signer = new Wallet(
              "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
              provider
            );
            return buildContractProvider(this.#address, signer as any);
          })
          .catch(handleError);
      } catch (err) {
        handleError(err);
      }
    }
  }

  /**
   *
   * Participation
   *
   */
  async onNominateAdmin(callback: (eventMeta: EventMeta) => void): Promise<SkyBlockContractType> {
    const provider = await this.provider;
    return provider.on("NominateAdmin", (existing, nominated) => {
      return callback(decodeEvent(existing, nominated));
    });
  }

  async onDualParticipant(callback: (eventMeta: EventMeta) => void): Promise<SkyBlockContractType> {
    const provider = await this.provider;
    return provider.on("AcceptNomination", (nominated, email) => {
      return callback(decodeEvent(nominated, email));
    });
  }

  async nominateAdmin({ cid }: ContractMethodProps) {
    const provider = await this.provider;
    const [arg1, arg2, arg3] = TrustedResourcesContract.encodeArgsForSolidity({
      participant: provider.address,
      cid
    });
    console.log({ arg1, arg2, arg3 });
    return provider.singleParticipant(arg1, arg2, arg3);
  }

  async acceptNomination({ cid, counterParty }: ContractMethodProps) {
    const provider = await this.provider;
    const [arg1, arg2, arg3] = TrustedResourcesContract.encodeArgsForSolidity({
      participant: provider.address,
      counterParty,
      cid
    }) as DualParticipantEvent;
    console.log({ arg1, arg2, arg3 });
    return provider.dualParticipant(arg1, arg2, arg3);
  }
}
