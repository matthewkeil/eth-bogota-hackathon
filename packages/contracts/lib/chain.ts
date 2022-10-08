export const chains = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
  137: "polygon",
  1337: "localhost",
  80001: "mumbai",
} as const;

export type Chain = typeof chains[keyof typeof chains];
