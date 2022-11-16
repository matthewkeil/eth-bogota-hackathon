import path from "path";
import { Construct } from "constructs";
import { Environment, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";

import {
  ServerlessNestedStack,
  CoreNestedStack,
  CDNNestedStack,
  ConfigFile,
  ConfigFileProps
} from "full-stack-pattern";
import { Code } from "aws-cdk-lib/aws-lambda";

const PACKAGES_FOLDER = path.resolve(__dirname, "..", "..");
const FRONTEND_DIST = path.resolve(PACKAGES_FOLDER, "frontend", "dist");
const BACKEND_DIST = path.resolve(PACKAGES_FOLDER, "backend", "dist");

interface SkyBlockProps {
  prefix: string;
  env: Required<Environment>;
  stage: string;
  subDomain?: string;
  rootDomain: string;
  hostedZoneId?: string;
  certificateArn?: string;
  stack?: StackProps;
  removalPolicy?: RemovalPolicy;
}

export class SkyBlock extends Stack {
  public core: CoreNestedStack;
  public cdn: CDNNestedStack;
  public serverless: ServerlessNestedStack;

  constructor(scope: Construct, id: string, private props: SkyBlockProps) {
    super(scope, id, { ...(props.stack ?? {}), stackName: props.prefix, env: props.env });

    this.core = new CoreNestedStack(this, "CoreStack", {
      // pass in values to not create new
      hostedZoneId: props.hostedZoneId,
      certificateArn: props.certificateArn,
      // create new resources
      rootDomain: props.rootDomain,
      certificate: {
        subjectAlternativeNames: [
          `www.${this.props.rootDomain}`,
          `api.${this.props.rootDomain}`,
          `auth.${this.props.rootDomain}`
        ]
      },
      includeStarSubdomain: true,
      removalPolicy: props.removalPolicy ?? RemovalPolicy.DESTROY
    });

    this.cdn = new CDNNestedStack(this, "Frontend", {
      stage: props.stage,
      prefix: props.prefix,
      bucketName: `${props.prefix}-frontend`,
      codePaths: [FRONTEND_DIST],
      hostedZone: this.core.hostedZone,
      certificate: this.core.certificate,
      domain: props.rootDomain,
      buildWwwSubdomain: props.stage === "prod",
      removalPolicy: props.removalPolicy ?? RemovalPolicy.DESTROY
    });

    this.serverless = new ServerlessNestedStack(this, "Serverless", {
      prefix: props.prefix,
      code: Code.fromAsset(BACKEND_DIST),
      lambdas: [
        {
          name: "accept-nomination",
          handler: "handlers/acceptNomination.handler",
          events: [
            {
              path: "accept-nomination",
              method: "POST"
            }
          ]
        }
      ]
    });
  }

  /**
   * Builds and uploads a configuration file to the ui bucket
   *
   * See [ConfigFile](https://full-stack-pattern.matthewkeil.com/docs/constructs/configFile) for more information
   */
  public addConfigFile({
    config,
    fileName,
    mergeExisting,
    deploymentRole
  }: Pick<
    ConfigFileProps<Record<string, unknown>>,
    "fileName" | "mergeExisting" | "config" | "deploymentRole"
  >) {
    new ConfigFile(this, "TRConfig", {
      config,
      fileName,
      mergeExisting,
      deploymentRole,
      env: this.props.env,
      prefix: this.props.prefix,
      bucket: this.cdn.bucket
    });
  }
}

// That's the HBAR Foundation that is part of Hedera ecosystem and is giving grants out
