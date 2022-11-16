import { APIGatewayProxyHandler } from "aws-lambda";
import { utils as ethersUtils } from "ethers";
import { createUser, generateAndEncryptPassword, sendSESEmail } from "../utils";

interface AcceptNominationRequest {
  emailAddress: string;
  walletAddress: string;
  publicKey: string;
  signature: string;
}

interface AcceptNominationResponse {
  username: string;
  password: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { body } = event;

  if (!body) {
    throw new Error("no body sent with request");
  }

  const { emailAddress, walletAddress, publicKey, signature } = JSON.parse(
    body
  ) as AcceptNominationRequest;

  let signerAddress: string;
  try {
    signerAddress = await ethersUtils.verifyMessage(walletAddress, signature);
  } catch (err) {
    console.log(err);
    throw new Error("error validating signature");
  }

  if (signerAddress !== walletAddress) {
    throw new Error("validation signature not signed by wallet");
  }

  const user = await createUser({ username: walletAddress });
  const { encrypted } = await generateAndEncryptPassword({ username: user.UserName, publicKey });
  await sendSESEmail({
    username: user.UserName,
    password: encrypted,
    emailAddress: emailAddress
  });

  const response: AcceptNominationResponse = {
    username: user.UserName,
    password: encrypted
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
