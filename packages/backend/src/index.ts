import "dotenv/config";
import { providers } from "ethers";
import { SkyBlockContractService } from "../../contracts/dist/src/SkyBlockContract";
import { createUser, sendSESEmail } from "./utils";

(async function () {
  // const address = "0x355562132E54364fcbF6f7a61b7a8f4Cb1B3fc30";
  // const provider = new providers.JsonRpcProvider("http://localhost:8545");

  const address = "0x355562132e54364fcbf6f7a61b7a8f4cb1b3fc30";
  const provider = new providers.InfuraProvider("goerli");
  const contractService = new SkyBlockContractService({ address, provider });

  contractService.onAcceptNomination(({ nominated, email }) => {
    createUser({
      address: nominated
    })
      .then(({ username, password }) => {
        return sendSESEmail({
          username,
          password,
          emailAddress: email as string
        });
      })
      .catch(console.error);
  });

  contractService.onNominateAdmin(({ nominated, existing }) => {
    console.log({ nominated, existing });
  });
})();
