import * as path from 'path';
import {workspace} from "coc.nvim";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {getRootWorkspacePath} from "../../salesforcedx-core/utils";
import {CancelResponse, ContinueResponse, ParametersGatherer} from "../../salesforcedx-utils-vscode";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {CliLogLevel} from '../../salesforcedx-core/model/cliLogLevels';

const DEFAULT_ANONYMOUS_APEX_FILE = 'scripts/apex/hello.apex';

interface ExecuteAnonymousApexOptions {
  apexCodeFile: string;
}

class ExecuteAnonymousApexGatherer implements ParametersGatherer<ExecuteAnonymousApexOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<ExecuteAnonymousApexOptions>> {
    const anonApexDir = path.resolve(getRootWorkspacePath(), DEFAULT_ANONYMOUS_APEX_FILE);
    const apexCodeFile = await workspace.requestInput('Enter Apex code file to execute', anonApexDir);

    if(!apexCodeFile) {
      return {
        type: 'CANCEL'
      }
    }

    return {
      type: 'CONTINUE',
      data: {
        apexCodeFile
      }
    }
  }
}

class ForceAnonymousApexExecutor extends SfdxCommandletExecutor<ExecuteAnonymousApexOptions> {
  public build(data: ExecuteAnonymousApexOptions): Command {
    return new SfdxCommandBuilder()
      .withDescription(`Execting anonymous Apex in default scratch org for: ${data.apexCodeFile}`)
      .withArg('force:apex:execute')
      .withFlag('--apexcodefile', data.apexCodeFile)
      .withFlag('--loglevel', CliLogLevel.DEBUG)
      .build()

  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new ExecuteAnonymousApexGatherer();

export async function forceRunAnonymousApex() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceAnonymousApexExecutor()
  );
  await commandlet.run();
}
