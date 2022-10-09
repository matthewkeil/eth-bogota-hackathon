import { SkyBlockContractService } from "../contracts/dist/src/SkyBlockContract";
import { ethers } from "ethers";

// 0xb95a21B151111D292787562100fff012F16f6874

// const connectBtn = document.getElementById("connect-btn");
// const address = "0x874b0F37636cE75E9ED48B5d55900a6089f20261";

const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const service = new SkyBlockContractService({ address, provider: signer });

const addressInput = document.getElementById("address-input");
const emailInput = document.getElementById("email-input");

const permissionBtn = document.getElementById("permission-btn");
permissionBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  console.log(addressInput.value);
  if (addressInput.value) {
    const transaction = await service.nominateAdmin(addressInput.value);
    await transaction.wait();
    buildNomineesHtml();
  }

  emailInput.classList.remove("hide");
  emailInput.classList.add("display");
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
  const nominees = await service.getNominees();
  for (const nominee of nominees) {
    const name = prettyAddresses(nominee);
    const nomineeBtn = document.createElement("button");
    nomineeBtn.textContent = name;
    nomineeBtn.classList.add("nominee");
    nomineeBtn.addEventListener("click", () => {
      acceptNomination(nominee);
    });
    nomineeList.appendChild(nomineeBtn);
  }
}

async function acceptNomination(nominee) {
  // console.log(nominee);

  if (emailInput) {
    const transaction = await service.acceptNomination(nominee);
    await transaction.wait();
  }

  // service.onAcceptNomination(nominee);
  emailInput.classList.add("hide");
  emailInput.classList.remove("display");
}

const main = async () => {
  if (!window.ethereum) {
    throw new Error("must have an ethereum wallet installed");
  }
  buildAdminsHtml();
  buildNomineesHtml();
};

main();
