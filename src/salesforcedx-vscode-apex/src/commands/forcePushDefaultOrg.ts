import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../../salesforcedx-utils-vscode/src/cli/commandBuilder";
import {workspace} from "coc.nvim";

interface SourcePushOptions {
  forcePush: boolean;
}

class PushToSourceGatherer implements ParametersGatherer<SourcePushOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<SourcePushOptions>> {
    const forcePush = await workspace.showPrompt('Do you wish to overwrite source conflicts, if any?')
    return {
      type: 'CONTINUE',
      data: {
        forcePush
      }
    };
  }
}

class ForcePushDefaultOrgExecutor extends SfdxCommandletExecutor<SourcePushOptions> {
  public build(data: SourcePushOptions): Command {
    const builder = new SfdxCommandBuilder();
    builder 
      .withDescription('Pushing to Default Scratch Org')
      .withArg('force:source:push')

    if(data.forcePush) {
      builder.withArg('--forceoverwrite')
    }

    return builder.build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new PushToSourceGatherer();

export async function forcePushDefaultOrg() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForcePushDefaultOrgExecutor()
  );
  await commandlet.run();
}

