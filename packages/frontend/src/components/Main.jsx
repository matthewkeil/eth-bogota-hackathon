import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract, useChain } from "react-moralis";
import { Input, Table, Button, TextArea } from "web3uikit";

import contractInfo from "../../abi.json";

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

  async function updateUI() {
    const adminsFromContract = await getAdmins();
    const nomineesFromContract = await getNominees();
    setAdmins(adminsFromContract);
    setNominee(nomineesFromContract);
    checkIsNominated(nomineesFromContract);
  }

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    updateUI();
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
      // checkIsNominated(nominees);
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

  return isNominated ? (
    <div className="flex flex-col items-center gap-6">
      <TextArea
        label="Enter Code"
        name="Test TextArea Default"
        onBlur={function noRefCheck() {}}
        onChange={function noRefCheck() {}}
        placeholder="Type here field"
        value=""
      />

      <Button
        color="blue"
        onClick={() => console.log("Clicked")}
        text="Accept Nomination"
        theme="colored"
      />
    </div>
  ) : (
    <div className="flex justify-evenly">
      <div className="flex flex-col gap-6 w-1/4 px-10 ml-10 my-2">
        <Input
          label="Wallet Address"
          placeholder="Address"
          value=""
          onChange={(event) => setNomineeAddress(event.target.value)}
        />
        <Input
          label="Enter nominee email"
          placeholder="hello@skyblock.io"
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
            await nominateAdmin({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error)
            });
          }}
          text="Nominate"
          theme="colored"
        />
      </div>
      <div className="flex justify-evenly w-3/4 px-10">
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
