import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../../salesforcedx-utils-vscode/src/cli/commandBuilder";
import ContinueGatherer from "./emptyContinue";

class ForcePushDefaultOrgExecutor extends SfdxCommandletExecutor<null> {
  public build(data: null): Command {
    return new SfdxCommandBuilder()
      .withDescription('Pushing to Default Scratch Org')
      .withArg('force:source:push')
      .build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new ContinueGatherer();

export async function forcePushDefaultOrg() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForcePushDefaultOrgExecutor()
  );
  await commandlet.run();
}

