import { SkyBlockContractService } from "../contracts/dist/src/SkyBlockContract";
import { ethers } from "ethers";

let provider = "";
const permissionBtn = document.getElementById("permission-btn");
const connectBtn = document.getElementById("connect-btn");
const decryptBtn = document.getElementById("decrypt-btn");
const permissionContainer = document.getElementById("permission-container");
const decryptContainer = document.getElementById("decrypt-container");
const passwordLabel = document.getElementById("decrypted-password");

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

permissionBtn.addEventListener("click", () => {});

decryptBtn.addEventListener("click", async () => {
  const encryptedMessage = document.getElementById("decrypt-input");

  // try {
  //   const { ethereum } = window;
  //   const accounts = await ethereum.request({ method: "eth_accounts" });
  //   const account = accounts[0];

  //   const decryptedMessage = await ethereum.request({
  //     method: "eth_decrypt",
  //     params: [encryptedMessage, accounts[0]]
  //   });

  //   passwordLabel.innerText = decryptedMessage;
  //   console.log("The decrypted message is:", decryptedMessage);
  // } catch (error) {
  //   console.log("error: ", error);
  // }

  passwordLabel.innerText = encryptedMessage.value; // just for testing
  encryptedMessage.value = "";
});

passwordLabel.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordLabel.innerText);
  alert("Copied the text: " + passwordLabel.innerText);
});

document.getElementById("permission-page-btn").addEventListener("click", () => {
  permissionContainer.classList.remove("hide");
  permissionContainer.classList.add("display");
  decryptContainer.classList.add("hide");
  decryptContainer.classList.remove("display");
});
document.getElementById("decrypting-page-btn").addEventListener("click", () => {
  permissionContainer.classList.add("hide");
  permissionContainer.classList.remove("display");
  decryptContainer.classList.remove("hide");
  decryptContainer.classList.add("display");
});

main();
