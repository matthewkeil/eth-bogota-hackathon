import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract, useChain } from "react-moralis";

import { abi, contractAddress } from "../../contractInfo.json";
import { TransactionResponse } from "@ethersproject/abstract-provider";

import Home from "./Home";
import Nominated from "./Nominated";

// const contractAddress = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
// const contractAddress = "0x5AD10DA226e611D1281d6a04a6833B535311cC57";

interface MainProps {
  checkIsNominated: (nominees: string[]) => boolean;
  isNominated: boolean;
}

export default function Main({ checkIsNominated, isNominated }: MainProps) {
  const { isWeb3Enabled } = useMoralis();
  const { account } = useChain();

  const [admins, setAdmins] = useState<string[]>([]);
  const [nominees, setNominee] = useState<string[]>([]);

  const { runContractFunction: getAdmins } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getAdmins",
    params: {},
    msgValue: ""
  });

  const { runContractFunction: getNominees } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getNominees",
    params: {},
    msgValue: ""
  });

  async function updateUI(tx?: TransactionResponse) {
    if (tx) {
      await tx.wait(1);
    }
    const adminsFromContract = (await getAdmins()) as string[];
    const nomineesFromContract = (await getNominees()) as string[];
    setAdmins(adminsFromContract);
    setNominee(nomineesFromContract);
    checkIsNominated(nomineesFromContract);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  return isNominated ? (
    <Nominated account={account} />
  ) : (
    <Home admins={admins} nominees={nominees} updateUI={updateUI} />
  );
}
