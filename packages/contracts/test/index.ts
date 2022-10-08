import hre from "hardhat";

import { S3 } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import { TrustedResourcesService } from "../src/TrustedResourcesService";
import { TrustedResourcesContract } from "../src/TrustedResourcesContract";
import { buildLocalProvider } from "../lib/utils";

(async function () {
  const [admin] = await hre.ethers.getSigners();
  const provider = buildLocalProvider({ signerAddress: admin.address });
  const contract = new TrustedResourcesContract({
    signed: provider
  });
  const service = new TrustedResourcesService({
    bucketName: "tripfs",
    s3: new S3({ region: "us-east-1", credentials: fromIni({ profile: "tr-prod" }) }),
    contract,
    ipfsConfig: {
      host: "127.0.0.1",
      port: 5001,
      protocol: "http"
      // apiPath: ""
    }
  });

  const msg = {
    hello: "world24"
  };

  service.getFileFromIpfs("QmQQMFqZf8Ak86axvkt6J4ABNwRU3XcAhqmENfHVjaA6Po").then(console.log);
})();
