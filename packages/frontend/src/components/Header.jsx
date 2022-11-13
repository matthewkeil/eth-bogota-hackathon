import { ConnectButton } from "web3uikit";

export default function Header(props) {
  const { isNominated } = props;
  return (
    <div className="grid grid-cols-3 justify-items-stretch items-center text-sky-50 bg-sky-900">
      <h1 className="py-4 px-4  font-bold text-xl">SkyBlock</h1>
      <h3 className="py-4 justify-self-center px-4 font-bold text-l">
        {isNominated ? "Accept Nomination" : "Nominate a New Admin"}
      </h3>
      <div className="justify-self-end">
        <ConnectButton />
      </div>
    </div>
  );
}
