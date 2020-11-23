import {workspace} from "coc.nvim";
import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../../salesforcedx-utils-vscode/src/cli/commandBuilder";

interface SourcePullOptions {
  forcePull: boolean;
}

class PullFromSourceGatherer implements ParametersGatherer<SourcePullOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<SourcePullOptions>> {
    const forcePull = await workspace.showPrompt('Do you wish to overwrite source conflicts, if any?')
    return {
      type: 'CONTINUE',
      data: {
        forcePull
      }
    };
  }
}

class ForcePullDefaultOrgExecutor extends SfdxCommandletExecutor<SourcePullOptions> {
  public build(data: SourcePullOptions): Command {
    const builder = new SfdxCommandBuilder();
    builder 
      .withDescription('Pulling from Default Scratch Org')
      .withArg('force:source:pull')

    if(data.forcePull) {
      builder.withArg('--forceoverwrite')
    }

    return builder.build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new PullFromSourceGatherer();

export async function forcePullDefaultOrg() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForcePullDefaultOrgExecutor()
  );
  await commandlet.run();
}
