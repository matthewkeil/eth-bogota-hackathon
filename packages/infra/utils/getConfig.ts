import { getLocalGitBranch } from "./getLocalGitBranch";
import { getStageName } from "./getStageName";

const staticProps = {
  client: "co",
  project: "tr",
  rootDomain: "trustedresources.org",
  repo: "eth-bogota-hackathon",
  repoOwner: "matthewkeil"
};

const stages: Stage[] = [
  // {
  //   branch: "DEFAULT",
  //   env: {
  //     account: "898920301749",
  //     region: "us-east-1"
  //   }
  // },
  {
    branch: "main",
    profile: "tr",
    env: {
      account: "241261170676",
      region: "us-east-1"
    }
  }
];

type StaticProps = typeof staticProps;
interface Stage {
  branch: string;
  profile: string;
  env: {
    account: string;
    region: string;
  };
}
type Config = StaticProps & Stage & { stage: string; prefix: string };

export async function getConfig(_branch?: string) {
  let branch = _branch;
  if (!branch) {
    if (process.env.BRANCH) {
      branch = process.env.BRANCH;
    } else {
      branch = await getLocalGitBranch();
    }
  }

  if (!branch) {
    throw new Error("could not determine what branch to deploy");
  }

  const stage = getStageName(branch);

  const stageConfig = stages.find((stage) => stage.branch === branch) ?? stages[0];

  return {
    ...staticProps,
    ...stageConfig,
    branch,
    stage,
    prefix: `${staticProps.client}-${staticProps.project}-${stage}`
  } as Config;
}
