import React, { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Input, Table, Button } from "web3uikit";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { abi, contractAddress } from "../../contractInfo.json";
import { prettyAddresses } from "./utils";

interface HomeProps {
  admins: string[];
  nominees: string[];
  updateUI: (tx: TransactionResponse) => void;
}

export default function Home({ admins, nominees, updateUI }: HomeProps) {
  const [nomineeAddress, setNomineeAddress] = useState("");

  const { runContractFunction: nominateAdmin } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "nominateAdmin",
    params: { _nominated: nomineeAddress },
    msgValue: ""
  });

  async function onNominateAdmin() {
    await nominateAdmin({
      onSuccess: (tx) => {
        setNomineeAddress("");
        updateUI(tx as TransactionResponse);
      },
      onError: (err) => console.log(err)
    });
  }

  function formatAdminList() {
    const formatted = [];
    let counter = 1;
    for (const admin of admins) {
      const adminInfo = ["", `Admin ${counter}`, "", prettyAddresses(admin)];
      formatted.push(adminInfo);
      counter++;
    }
    return formatted;
  }

  function formatNomineeList() {
    const formatted = [];
    let counter = 1;
    for (const nominee of nominees) {
      const nomineeInfo = ["", `Nominee ${counter}`, "", prettyAddresses(nominee)];
      formatted.push(nomineeInfo);
      counter++;
    }
    return formatted;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-6 w-1/3 px-10 ml-10 my-2">
        <Input
          name="address"
          width="100%"
          label="Wallet Address"
          placeholder="Address"
          value={nomineeAddress}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNomineeAddress(e.currentTarget.value)
          }
        />
        <Button
          isFullWidth={true}
          size="large"
          color="blue"
          onClick={onNominateAdmin}
          text="Nominate"
          theme="colored"
        />
      </div>
      <div className="flex justify-center gap-20 w-3/4 p-10 mt-1  0">
        <Table
          columnsConfig="10px 2fr 2fr 3fr 10px"
          data={formatAdminList()}
          header={["", <span>DAO Admin</span>, "", <span>Address</span>]}
          maxPages={3}
          pageSize={5}
          // onPageNumberChanged={function noRefCheck() {}}
          // onRowClick={function noRefCheck() {}}
        />
        <Table
          columnsConfig="10px 2fr 1fr 2fr 10px"
          data={formatNomineeList()}
          header={["", <span>DAO Nominees</span>, "", <span>Address</span>]}
          maxPages={3}
          pageSize={5}
          // onPageNumberChanged={function noRefCheck() {}}
          // onRowClick={function noRefCheck() {}}
        />
      </div>
    </div>
  );
}
