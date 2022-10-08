import { resolve } from "path";
import { toPascal } from "./changeCase";

export type StateMutability = "nonpayable" | "view";

export interface FunctionInputOutput {
  internalType: string;
  name: string;
  type: string;
}

export interface ConstructorSegment {
  type: "constructor";
  inputs: FunctionInputOutput[];
  stateMutability: StateMutability;
}

export interface FunctionSegment {
  type: "function";
  name: string;
  inputs: FunctionInputOutput[];
  outputs: FunctionInputOutput[];
  stateMutability: StateMutability;
}

export interface EventInputOutput extends FunctionInputOutput {
  indexed: boolean;
}

export interface EventSegment {
  type: "event";
  name: string;
  anonymous: boolean;
  inputs: EventInputOutput[];
  outputs: EventInputOutput[];
  stateMutability: StateMutability;
}

export type AbiSegment = ConstructorSegment | FunctionSegment | EventSegment;

export type Abi = AbiSegment[];

export function getAbi(name: string): Abi {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const factory = require(resolve(
    __dirname,
    "..",
    "typechain",
    "factories",
    `${toPascal(name)}__factory`
  ));
  return factory.abi;
}
