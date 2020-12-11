import {workspace} from "coc.nvim";
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {SOURCE_CONFLICTS_OVERWRITE_PROMPT} from "../../salesforcedx-core/constants";
import {CliLogLevel} from "../../salesforcedx-core/model/cliLogLevels";

interface SourcePushOptions {
  forceOverwrite: boolean;
}

class PushToSourceGatherer implements ParametersGatherer<SourcePushOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<SourcePushOptions>> {
    const forceOverwrite = await workspace.showPrompt(SOURCE_CONFLICTS_OVERWRITE_PROMPT);
    return {
      type: 'CONTINUE',
      data: {
        forceOverwrite
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
      .withFlag('--loglevel', CliLogLevel.DEBUG)

    if(data.forceOverwrite) {
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

