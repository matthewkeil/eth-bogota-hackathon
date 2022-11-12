import { useMoralis, useChain } from "react-moralis";
import { Hero, CryptoCards, ChainSelector } from "web3uikit";

import Header from "./components/Header";
import Admins from "./components/Admins";

function App() {
  const { chainId: chainIdHex } = useMoralis();
  const { switchNetwork } = useChain();
  const chainId = parseInt(chainIdHex);
  return (
    <div className="text-black h-screen bg-sky-50 ">
      <Header />
      <Hero
        backgroundColor=""
        title="DAO Management of Cloud Computing Accounts"
        subTitle="Add the wallet address of someone you want to nominate"
        height="200px"
      />
      {chainId !== 5 ? (
        <div className="flex justify-center">
          <ChainSelector
            providers={[
              {
                chain: "Switch to",
                chainId: "0x5",
                name: "Goerli",
                network: "testnet"
              }
            ]}
            setValue={function noRefCheck() {
              switchNetwork("0x5");
            }}
            values={[
              {
                chainId: "0x5"
              }
            ]}
          />
        </div>
      ) : (
        <Admins />
      )}
    </div>
  );
}

export default App;
