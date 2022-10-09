import { SkyBlockContractService } from "../contracts/dist/src/SkyBlockContract";
import { ethers } from "ethers";

// const connectBtn = document.getElementById("connect-btn");

// const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const service = new SkyBlockContractService({ address, provider: signer });

const addressInput = document.getElementById("address-input");

const permissionBtn = document.getElementById("permission-btn");
permissionBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log(addressInput.value);
  const transaction = await service.nominateAdmin(addressInput.value);
  await transaction.wait();
  buildNomineesHtml();
});

const decryptBtn = document.getElementById("decrypt-btn");
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

const passwordLabel = document.getElementById("decrypted-password");
passwordLabel.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordLabel.innerText);
  alert("Copied the text: " + passwordLabel.innerText);
});

const permissionContainer = document.getElementById("permission-container");
const decryptContainer = document.getElementById("decrypt-container");
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

function prettyAddresses(address) {
  return `${address.substr(0, 6)}...${address.substr(address.length - 4)}`;
}

const adminList = document.getElementById("dao-admin-list");
async function buildAdminsHtml() {
  let html = adminList.innerHTML;
  const admins = await service.getAdmins();
  for (const admin of admins) {
    const name = prettyAddresses(admin);
    html += `
      <p>${name}</p>
    `;
  }

  adminList.innerHTML = html;
}

const nomineeList = document.getElementById("admin-nominees-list");
async function buildNomineesHtml() {
  let html = nomineeList.innerHTML;
  const nominees = await service.getNominees();
  for (const nominee of nominees) {
    const name = prettyAddresses(nominee);
    html += `
      <p>${name}</p>
    `;
  }

  nomineeList.innerHTML = html;
}

const main = async () => {
  if (!window.ethereum) {
    throw new Error("must have an ethereum wallet installed");
  }
  buildAdminsHtml();
  buildNomineesHtml();
};

main();

// 0x88E6771137fb4Ae012f9c5398728107e61501944
