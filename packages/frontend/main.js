import { SkyBlockContractService } from "../contracts/dist/src/SkyBlockContract";
import { ethers } from "ethers";

const permissionBtn = document.getElementById("permission-btn");
const addressInput = document.getElementById("address-input");
const adminList = document.getElementById("dao-admin-list");
const nomineeList = document.getElementById("admin-nominees-list");

// const connectBtn = document.getElementById("connect-btn");

// const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const service = new SkyBlockContractService({ address, provider: signer });

function prettyAddresses(address) {
  return `${address.substr(0, 6)}...${address.substr(address.length - 4)}`;
}

async function getAdminsHtml() {
  let html = "";
  const admins = await service.getAdmins();
  for (const admin of admins) {
    const name = prettyAddresses(admin);
    html += `
      <p>${name}</p>
    `;
  }

  adminList.innerHTML = `
  ${adminList.innerHTML}
  ${html}
  `;
}

async function getNomineesHtml() {
  let html = "";
  const nominees = await service.getNominees();
  for (const nominee of nominees) {
    const name = prettyAddresses(nominee);
    html += `
      <p>${name}</p>
    `;
  }

  nomineeList.innerHTML = `
  ${nomineeList.innerHTML}
  ${html}
  `;
}

const main = async () => {
  if (!window.ethereum) {
    throw new Error("must have an ethereum wallet installed");
  }
  getAdminsHtml();
  getNomineesHtml();
};

permissionBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log(addressInput.value);
  const transaction = await service.nominateAdmin(addressInput.value);
  await transaction.wait();
  getNomineesHtml();
});

main();

// 0x88E6771137fb4Ae012f9c5398728107e61501944

// const MetaMaskClientCheck = async () => {
//   if (isMetaMaskInstalled()) {
//     // isWalletConnected();
//   } else {
//     isWalletNotInstall();
//   }
// };

// const isMetaMaskInstalled = () => {
//   const { ethereum } = window;
//   return Boolean(ethereum && ethereum.isMetaMask);
// };

// const isWalletConnected = async () => {
//   try {
//     // const { ethereum } = window;
//     // const accounts = await ethereum.request({ method: "eth_accounts" });
//     // const account = accounts[0];
//     // let name = await provider.lookupAddress(account);
//     // if (!name) {
//     // const name = prettyAddresses(account);
//     // }
//     // connectBtn.innerText = `${name}`;
//   } catch (error) {
//     console.log("error: ", error);
//   }
// };

// const isWalletNotInstall = async () => {
//   connectBtn.innerText = "Install MetaMask!";
// };
