import { exec } from "../utils/exec";
import { getConfig } from "../utils/getConfig";
import { loginAwsCli } from "./loginAwsCli";

export async function synth(): Promise<void> {
  const config = await getConfig();
  console.log(config);
  const {
    profile,
    branch,
    env: { account }
  } = config;

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

  await exec(`npx cdk synth --quiet${_profile}`);
}

if (require.main === module) {
  synth();
}
