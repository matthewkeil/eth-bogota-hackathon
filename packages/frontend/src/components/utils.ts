export function prettyAddresses(address) {
  return `${address.substr(0, 6)}...${address.substr(address.length - 4)}`;
}
