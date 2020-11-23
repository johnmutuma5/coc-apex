import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import ContinueGatherer from "./emptyContinue";


class ForceGeneratePasswordExecutor extends SfdxCommandletExecutor<null> {
  public build(data: null): Command {
    return new SfdxCommandBuilder()
      .withDescription('Generating Password for Default Scratch Org')
      .withArg('force:user:password:generate')
      .build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new ContinueGatherer();

export async function forceGeneratePassword() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceGeneratePasswordExecutor()
  );
  await commandlet.run();
}

