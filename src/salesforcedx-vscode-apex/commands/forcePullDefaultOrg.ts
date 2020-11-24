import {workspace} from "coc.nvim";
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {SOURCE_CONFLICTS_OVERWRITE_PROMPT} from "../../salesforcedx-core/constants";
import {CliLogLevel} from "../../salesforcedx-core/model/cliLogLevels";

interface SourcePullOptions {
  forceOverwrite: boolean;
}

class PullFromSourceGatherer implements ParametersGatherer<SourcePullOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<SourcePullOptions>> {
    const forceOverwrite = await workspace.showPrompt(SOURCE_CONFLICTS_OVERWRITE_PROMPT);
    return {
      type: 'CONTINUE',
      data: {
        forceOverwrite
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
      .withFlag('--loglevel', CliLogLevel.DEBUG)

    if(data.forceOverwrite) {
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
