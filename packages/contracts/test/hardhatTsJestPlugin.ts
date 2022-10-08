import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import { task } from "hardhat/config";
import { runCLI } from "jest";

task("ts-jest", "Runs jest tests")
  .addFlag("compile", "run hardhat compile before testing")
  .addFlag("watch", "run tests in watch mode")
  .addOptionalParam("project", "tsconfig file path")
  // .addOptionalParam("testGlob", "globing pattern of tests to run. must be in parentheses")
  .setAction(async (taskArgs, { config, run }) => {
    const args = {
      ...taskArgs
    };
    if (args.compile) {
      await run(TASK_COMPILE);
    }

    delete args.noCompile;
    await runCLI(args, [config.paths.root + "/jest.config.js"]);
  });
