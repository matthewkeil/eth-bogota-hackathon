import { ethers } from "ethers";

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
