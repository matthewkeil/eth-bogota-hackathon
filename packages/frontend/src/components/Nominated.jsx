import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { Input, Button } from "web3uikit";

import { abi, contractAddress } from "../../contractInfo.json";

function Nominated({ account }) {
  const [nomineeEmail, setNomineeEmail] = useState("");

  const { runContractFunction: acceptNomination } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "acceptNomination",
    params: { email: ethers.utils.formatBytes32String(nomineeEmail) },
    msgValue: ""
  });

  async function onAcceptNomination() {
    if (!window.ethereum) {
      throw new Error("no wallet found");
    }

    const publicKey = await window.ethereum
      .request({
        method: "eth_getEncryptionPublicKey",
        params: [account]
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          throw new Error("We can't encrypt anything without the key.");
        } else {
          console.error(err);
        }
      });

    console.log(publicKey);
    await acceptNomination();
    setNomineeEmail("");
  }

  return (
    <div className="flex flex-col items-center gap-6 w-1/4 m-auto">
      <Input
        name="email"
        width="100%"
        label="Enter your email"
        placeholder="hello@skyblock.io"
        value={nomineeEmail}
        onChange={(e) => setNomineeEmail(e.target.value)}
        type="email"
        validation={{
          maxLength: 48,
          minLength: 1,
          pattern: "^[^@s]+@[^@s]+.[^@s]+$",
          regExpInvalidMessage: "That is not a valid email address",
          required: false
        }}
      />

      <Button
        isFullWidth="true"
        color="blue"
        onClick={onAcceptNomination}
        text="Accept Nomination"
        theme="colored"
        size="large"
      />
    </div>
  );
}

export default Nominated;
