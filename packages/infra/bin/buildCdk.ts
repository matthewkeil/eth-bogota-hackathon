import { App } from "aws-cdk-lib";
import { CoreConstruct } from "full-stack-pattern";
import { getConfig } from "../utils/getConfig";
import { SkyBlock } from "../src/SkyBlock";

const app = new App();

export async function buildCdk() {
  const config = await getConfig();
  console.log({ config });
  const { prefix, stage, rootDomain, env, profile } = config;

  const { hostedZoneId, certificateArn } = await CoreConstruct.lookupExistingResources({
    region: env.region,
    profile,
    rootDomain
  });

  new SkyBlock(app, "SkyBlock", {
    env,
    prefix,
    stage,
    rootDomain,
    hostedZoneId,
    certificateArn
  });
}

if (require.main === module) {
  buildCdk().then(() => app.synth());
}
