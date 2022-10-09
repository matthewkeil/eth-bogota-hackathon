import "dotenv/config";
import { providers } from "ethers";
import { SkyBlockContractService } from "../../contracts/dist/src/SkyBlockContract";

(async function () {
  // const address = "0x355562132e54364fcbf6f7a61b7a8f4cb1b3fc30";
  const address = "0x88E6771137fb4Ae012f9c5398728107e61501944";
  const provider = new providers.JsonRpcProvider("http://localhost:8545");
  const contractService = new SkyBlockContractService({ address, provider });

  contractService.onAcceptNomination(({ nominated, email }) => {
    console.log({ nominated, email });
  });

  contractService.onNominateAdmin(({ nominated, existing }) => {
    console.log({ nominated, existing });
  });
})();
