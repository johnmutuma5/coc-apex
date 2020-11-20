import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../../salesforcedx-utils-vscode/src/cli/commandBuilder";

class ContinueGatherer implements ParametersGatherer<void> {
  public async gather(): Promise<CancelResponse | ContinueResponse<null>> {
    return {
      type: 'CONTINUE',
      data: null
    }
  }
}

class ForceOpenDefaultOrgExecutor extends SfdxCommandletExecutor<null> {
  public build(data: null): Command {
    return new SfdxCommandBuilder()
      .withDescription('Opening Default Scratch Org')
      .withArg('force:org:open')
      .build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new ContinueGatherer();

export async function forceOpenDefaultOrg() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceOpenDefaultOrgExecutor()
  );
  await commandlet.run();
}

