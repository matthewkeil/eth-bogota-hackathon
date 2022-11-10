import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="flex justify-between items-center bg-sky-900">
      <h1 className="py-4 px-4 font-bold text-3xl">SkyBlock</h1>
      <h3 className="py-4 px-4 font-bold text-xl">Permission View</h3>
      <ConnectButton />
    </div>
  );
}
