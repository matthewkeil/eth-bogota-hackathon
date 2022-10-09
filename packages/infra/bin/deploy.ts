import { exec } from "../utils/exec";
import { getConfig } from "../utils/getConfig";
import { loginAwsCli } from "./loginAwsCli";

export async function deploy(): Promise<void> {
  const stackName: string = process.env.STACK || "--all";
  const {
    profile,
    branch,
    env: { account }
  } = await getConfig();

  let _profile = ` --profile ${profile}`;
  if (process.env.CICD === "true") {
    _profile = "";
  } else {
    await loginAwsCli({ profile, account });
  }

  // eslint-disable-next-line no-console
  console.log(`>>>
>>> Synthesizing '${branch}' branch for deploy to ${profile} account
>>> Using profile ${_profile === "" ? "default" : profile}
>>>\n\n`);

  const command = `npx cdk deploy ${stackName} --no-rollback --require-approval never --profile ${profile}`;
  await exec(command).catch(console.log);
}

if (require.main === module) {
  deploy();
}
