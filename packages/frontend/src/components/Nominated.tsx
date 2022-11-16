import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3Contract } from "react-moralis";
import { Input, Button } from "web3uikit";

import { abi, contractAddress } from "../../contractInfo.json";

interface NominatedProps {
  account: string | null;
}

function Nominated({ account }: NominatedProps) {
  const [nomineeEmail, setNomineeEmail] = useState("");

  const { runContractFunction: acceptNomination } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "acceptNomination",
    params: { email: ethers.utils.formatBytes32String(nomineeEmail) },
    msgValue: ""
  });

  async function onAcceptNomination() {
    if (!window.ethereum.request) {
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

    console.log(account);

    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [account, account]
    });

    console.log({ publicKey, signature });

    // await acceptNomination({
    //   onSuccess: () => setNomineeEmail(""),
    //   onError: (err) => console.error(err)
    // });

    const response = await fetch(
      "https://zzetx327wk.execute-api.us-east-1.amazonaws.com/prod/accept-nomination",
      {
        method: "POST",
        body: JSON.stringify({
          emailAddress: nomineeEmail,
          walletAddress: account,
          publicKey,
          signature
        })
      }
    );

    console.log(response);
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
          characterMaxLength: 48,
          characterMinLength: 1,
          required: true
          // regExp: "^[^@s]+@[^@s]+.[^@s]+$",
          // regExpInvalidMessage: "That is not a valid email address",
          // maxLength: 48,
          // minLength: 1,
        }}
      />

      <Button
        isFullWidth={true}
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
