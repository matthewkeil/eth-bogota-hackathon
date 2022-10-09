import "dotenv/config";
import { providers } from "ethers";
import { SkyBlockContractService } from "../../contracts/dist/src/SkyBlockContract";

(async function () {
  // const address = "0x355562132e54364fcbf6f7a61b7a8f4cb1b3fc30";
  const address = "0x9aec505579a2f96f235bedb5f6e8635ac6c9ecab";
  const provider = new providers.InfuraProvider("goerli");
  const contractService = new SkyBlockContractService({ address, provider });

  contractService.onAcceptNomination(({ nominated, email }) => {
    console.log({ nominated, email });
  });

  contractService.onNominateAdmin(({ nominated, existing }) => {
    console.log({ nominated, existing });
  });
})();
