import "dotenv/config";
import { IAM, SES, SharedIniFileCredentials, AWSError } from "aws-sdk";
// import sendgrid from "@sendgrid/mail";
import { encrypt } from "@metamask/eth-sig-util";
import { bufferToHex } from "ethereumjs-util";

const credentials = new SharedIniFileCredentials({ profile: "tr" });
const iam = new IAM({ credentials });
const ses = new SES({ region: "us-east-1", credentials });

// const apiKey = `${process.env.SENDGRID_API_KEY}`;
// sendgrid.setApiKey(apiKey);

interface CreateUserProps {
  username: string;
}

export async function createUser({ username }: CreateUserProps) {
  let existingUser: IAM.User | undefined;
  try {
    ({ User: existingUser } = await iam.getUser({ UserName: username }).promise());
  } catch (err) {
    if (err instanceof Error && (err as AWSError).code === "NoSuchEntity") {
      console.log("no existing user found. making new user");
    } else {
      throw err;
    }
  }
  if (existingUser) {
    console.log("existing user found with that address");
    return existingUser;
  }

  const { User } = await iam
    .createUser({
      UserName: username
    })
    .promise();

  if (!User) {
    throw new Error("error creating user");
  }

  await iam
    .addUserToGroup({
      UserName: User.UserName,
      GroupName: "TRAdmin"
    })
    .promise();

  return User;
}

function getNonce() {
  return Math.floor(999 * Math.random() + 1);
}

interface GeneratePasswordProps {
  username: string;
  publicKey: string;
}
interface GeneratePasswordResponse {
  encrypted: string;
  unencrypted: string;
}
export async function generateAndEncryptPassword({
  username,
  publicKey
}: GeneratePasswordProps): Promise<GeneratePasswordResponse> {
  const password = `EthGlobalRocks${getNonce()}!`;
  console.log(password);

  await iam
    .createLoginProfile({
      UserName: username,
      Password: password,
      PasswordResetRequired: true
    })
    .promise();

  const encryptedData = encrypt({
    publicKey,
    data: password,
    version: "x25519-xsalsa20-poly1305"
  });

  return {
    encrypted: bufferToHex(Buffer.from(JSON.stringify(encryptedData), "utf8")),
    unencrypted: password
  };
}

function createEmailBody({ username, password }: SendEmailProps) {
  return `Thank you for you interest in helping us manage SkyBlock.

Your username is: ${username}
Your encrypted password is: ${password}

We have created a helper function for you to safely decrypt your password.  We 
have secured it with your public key and you can decrypt it using your private
key.  Please visit the website where you accepted your admin position and check
out the  "decrypt my password" section for instructions on how to proceed.  You
will be asked by metamask (or your chosen compatible wallet) for authorization
to decrypt it safely.  DO NOT SHARE your admin password with anyone.  Your
account, cleverly enough, has been provided with admin access.  Use your best
judgement as the DAO is watching you...

Thanks,
- The DAO for which you now admin
`;
}

interface SendEmailProps {
  username: string;
  password: string;
  emailAddress: string;
}
export function sendSESEmail(props: SendEmailProps) {
  return ses
    .sendEmail({
      Source: "admin@trustedresources.org",
      Destination: {
        ToAddresses: [props.emailAddress]
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: "Admin Account Information for SkyBlock"
        },
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: createEmailBody(props)
          }
        }
      }
    })
    .promise();
}

// export function sendGridEmail(props: SendEmailProps) {
//   return sendgrid.send({
//     from: "admin@trustedresources.org",
//     to: props.emailAddress,
//     subject: "Admin Account Information for SkyBlock",
//     text: createEmailBody(props)
//   });
// }
