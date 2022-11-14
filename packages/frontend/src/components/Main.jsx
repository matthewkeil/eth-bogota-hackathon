import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract, useChain } from "react-moralis";
import { Input, Table, Button } from "web3uikit";

import contractInfo from "../../abi.json";
import { ethers } from "ethers";

// const contractAddress = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
const contractAddress = "0x5AD10DA226e611D1281d6a04a6833B535311cC57";
const contractAbi = contractInfo;

export default function Main(props) {
  const { checkIsNominated, isNominated } = props;

  const { isWeb3Enabled } = useMoralis();
  const { account } = useChain();

  const [admins, setAdmins] = useState([]);
  const [nominees, setNominee] = useState([]);
  const [nomineeAddress, setNomineeAddress] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");

  const { runContractFunction: getAdmins } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: contractAddress,
    functionName: "getAdmins",
    params: {},
    msgValue: ""
  });

  const { runContractFunction: getNominees } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: contractAddress,
    functionName: "getNominees",
    params: {},
    msgValue: ""
  });

  const { runContractFunction: nominateAdmin } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: contractAddress,
    functionName: "nominateAdmin",
    params: { _nominated: nomineeAddress },
    msgValue: ""
  });

  const { runContractFunction: acceptNomination } = useWeb3Contract({
    abi: contractAbi,
    contractAddress: contractAddress,
    functionName: "acceptNomination",
    params: { email: ethers.utils.formatBytes32String(nomineeEmail) },
    msgValue: ""
  });

  async function updateUI() {
    const adminsFromContract = await getAdmins();
    const nomineesFromContract = await getNominees();
    setAdmins(adminsFromContract);
    setNominee(nomineesFromContract);
    checkIsNominated(nomineesFromContract);
  }

  async function handleSuccess(tx) {
    await tx.wait(1);
    updateUI();
  }

  function handleChangeNomineeAddress(event) {
    setNomineeAddress(event.target.value);
  }

  function handleChangeNomineeEmail(event) {
    setNomineeEmail(event.target.value);
  }

  function handleClickNomination() {
    setNomineeAddress("");
  }

  function handleClickAcceptNomination() {
    setNomineeEmail("");
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  function adminList() {
    const data = [];
    let counter = 1;
    for (let admin of admins) {
      const adminInfo = ["", `Admin ${counter}`, "", prettyAddresses(admin)];
      data.push(adminInfo);
      counter++;
    }
    return data;
  }

  function nomineeList() {
    const data = [];
    let counter = 1;
    for (let nominee of nominees) {
      const nomineeInfo = ["", `Nominee ${counter}`, "", prettyAddresses(nominee)];
      data.push(nomineeInfo);
      counter++;
    }
    return data;
  }

  console.log(ethers.utils.formatBytes32String(nomineeEmail));

  return isNominated ? (
    <div className="flex flex-col items-center gap-6 w-1/4 m-auto">
      <Input
        name="email"
        width="100%"
        label="Enter your email"
        placeholder="hello@skyblock.io"
        value={nomineeEmail}
        onChange={handleChangeNomineeEmail}
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
        onClick={async () => {
          await acceptNomination({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error)
          });
          handleClickAcceptNomination();
        }}
        text="Accept Nomination"
        theme="colored"
        size="large"
      />
    </div>
  ) : (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-6 w-1/3 px-10 ml-10 my-2">
        <Input
          name="address"
          width="100%"
          label="Wallet Address"
          placeholder="Address"
          value={nomineeAddress}
          onChange={handleChangeNomineeAddress}
        />
        <Button
          isFullWidth="true"
          size="large"
          color="blue"
          onClick={async () => {
            await nominateAdmin({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error)
            });
            handleClickNomination();
          }}
          text="Nominate"
          theme="colored"
        />
      </div>
      <div className="flex justify-center gap-20 w-3/4 p-10 mt-1  0">
        <Table
          columnsConfig="10px 2fr 2fr 3fr 10px"
          data={[...adminList()]}
          header={["", <span>DAO Admin</span>, "", <span>Address</span>]}
          maxPages={3}
          onPageNumberChanged={function noRefCheck() {}}
          onRowClick={function noRefCheck() {}}
          pageSize={5}
        />
        <Table
          columnsConfig="10px 2fr 1fr 2fr 10px"
          data={[...nomineeList()]}
          header={["", <span>DAO Nominees</span>, "", <span>Address</span>]}
          maxPages={3}
          onPageNumberChanged={function noRefCheck() {}}
          onRowClick={function noRefCheck() {}}
          pageSize={5}
        />
      </div>
    </div>
  );
}

function prettyAddresses(address) {
  return `${address.substr(0, 6)}...${address.substr(address.length - 4)}`;
}
