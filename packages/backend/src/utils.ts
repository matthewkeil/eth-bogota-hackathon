import { publicEncrypt } from "crypto";
import { IAM, SES } from "aws-sdk";
import sendgrid from "@sendgrid/mail";

const iam = new IAM();
const ses = new SES({ region: "us-east-1" });

sendgrid.setApiKey(`${process.env.SENDGRID_API_KEY}`);

interface CreateUserProps {
  address: string;
}

function getNonce() {
  return Math.floor(999 * Math.random() + 1);
}

export async function createUser({ address }: CreateUserProps) {
  const { User } = await iam
    .createUser({
      UserName: address
    })
    .promise();

  if (!User) {
    throw new Error("error creating user");
  }

  const password = `EthGlobalRocks${getNonce()}!`;

  const { LoginProfile } = await iam
    .createLoginProfile({
      UserName: User.UserName,
      Password: password,
      PasswordResetRequired: true
    })
    .promise();

  const encryptedPassword = publicEncrypt(address, Buffer.from(password)).toString();

  console.log({ LoginProfile, encryptedPassword });

  return {
    username: address,
    password: encryptedPassword
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

export function sendGridEmail(props: SendEmailProps) {
  return sendgrid.send({
    from: "admin@trustedresources.org",
    to: props.emailAddress,
    subject: "Admin Account Information for SkyBlock",
    text: createEmailBody(props)
  });
}
