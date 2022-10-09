import { SkyBlockContractService } from "../contracts/dist/src/SkyBlockContract";
import { ethers } from "ethers";

let provider = "";
const permissionBtn = document.getElementById("permission-btn");
const connectBtn = document.getElementById("connect-btn");

const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
let service = "";

const main = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    service = new SkyBlockContractService({ address });
  }
  getDaoAdminsHtml();
  MetaMaskClientCheck();
};

const getDaoAdminsHtml = async () => {
  let html = "";
  const admins = await service.getAdmins();
  for (const admin of admins) {
    let name = await provider.lookupAddress(admin);
    if (!name) {
      name = prettyAddresses(admin);
    }
    html += `
      <p>${name}</p>
    `;
  }

  document.getElementById("dao-member-list").innerHTML = `
  ${document.getElementById("dao-member-list").innerHTML}
  ${html}
  `;
};

const MetaMaskClientCheck = async () => {
  if (isMetaMaskInstalled()) {
    isWalletConnected();
  } else {
    isWalletNotInstall();
  }
};

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

const isWalletConnected = async () => {
  try {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_accounts" });

    const account = accounts[0];
    let name = await provider.lookupAddress(account);
    if (!name) {
      name = prettyAddresses(account);
    }
    connectBtn.innerText = `${name}`;
  } catch (error) {
    console.log("error: ", error);
  }
};

const isWalletNotInstall = async () => {
  connectBtn.innerText = "Install MetaMask!";
};

const prettyAddresses = (address) => {
  return `${address.substr(0, 6)}...${address.substr(address.length - 4)}`;
};

permissionBtn.addEventListener("click", () => {
  console.log("clicked");
});

main();
