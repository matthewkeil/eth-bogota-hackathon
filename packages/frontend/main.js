import { SkyBlockContractService } from "../contracts/dist/src/SkyBlockContract";

const permissionBtn = document.getElementById("permission-btn");
const connectBtn = document.getElementById("connect-btn");

const getDaoAdminsHtml = () => {
  document.getElementById("dao-member-list").innerHTML = `
  ${document.getElementById("dao-member-list").innerHTML}
  `;
};

// async function connect() {
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//     } catch (error) {
//       console.log(error);
//     }

//     connectBtn.innerHTML = "Connected!";
//   } else {
//     connectBtn.innerHTML = "Please install Metamask!";
//   }
// }

permissionBtn.addEventListener("click", () => {
  console.log("clicked");
  getDaoAdminsHtml();
});
// connectBtn.addEventListener("click", connect);

const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const service = new SkyBlockContractService({ address });
service.getAdmins().then(console.log);
service.getNominees().then(console.log);
