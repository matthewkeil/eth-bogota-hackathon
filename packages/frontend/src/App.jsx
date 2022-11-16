import { useState } from "react";
import { useMoralis, useChain } from "react-moralis";
import { Hero, ChainSelector } from "web3uikit";

import Header from "./components/Header";
import Main from "././components/Main";

function App() {
  const [isNominated, setIsNominated] = useState(false);

  const { chainId: chainIdHex } = useMoralis();
  const { switchNetwork, account } = useChain();
  const chainId = parseInt(chainIdHex);

  function checkIsNominated(nominees) {
    if (nominees.length > 0) {
      for (let nominee of nominees) {
        if (nominee.toUpperCase() === account.toUpperCase()) {
          setIsNominated(true);
          return;
        }
      }
      setIsNominated(false);
    }
  }

  return (
    <div className="text-black">
      <Header isNominated={isNominated} />
      <Hero
        backgroundColor=""
        title="DAO Management of Cloud Computing Accounts"
        subTitle={
          isNominated
            ? "Accept nomination and become a new admin of the DAO"
            : "Add the wallet address of someone you want to nominate"
        }
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
        <Main isNominated={isNominated} checkIsNominated={checkIsNominated} />
      )}
    </div>
  );
}

export default App;
