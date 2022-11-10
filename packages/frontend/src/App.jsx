import { useState } from "react";
import Header from "./components/Header";

import { useMoralis } from "react-moralis";

function App() {
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex);

  // console.log(chainId, account, isWeb3Enabled);

  return (
    <div className="h-screen bg-sky-50 ">
      <Header />
      <p className="text-black">{chainId === 137 ? "Polygon " : "Switch Network to Polygon"}</p>
    </div>
  );
}

export default App;
