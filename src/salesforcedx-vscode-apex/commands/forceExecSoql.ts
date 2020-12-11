import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {SfdxCommandletExecutor} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {CliLogLevel} from "../../salesforcedx-core/model/cliLogLevels";
import {getCurrentLine} from "../../salesforcedx-core/utils/nvim";

interface ExecSoqlOptions {
  soqlString: string;
}

class ExecSoqlGatherer implements ParametersGatherer<ExecSoqlOptions> {
  public async gather(): Promise<CancelResponse | ContinueResponse<ExecSoqlOptions>> {
    const soqlString = (await getCurrentLine());
    if(!soqlString.length) {
      return {
        type: 'CANCEL'
      }
    }
    return {
      type: 'CONTINUE',
      data: {
        soqlString
      }
    };
  }
}

class ForcePullDefaultOrgExecutor extends SfdxCommandletExecutor<ExecSoqlOptions> {
  public build(data: ExecSoqlOptions): Command {
    const builder = new SfdxCommandBuilder();
    builder 
      .withDescription('Executing query in Default Scratch Org')
      .withArg('force:data:soql:query')
      .withFlag('--query', data.soqlString)
      .withFlag('--loglevel', CliLogLevel.DEBUG)

    return builder.build();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new ExecSoqlGatherer();

export async function forceExecSoql() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForcePullDefaultOrgExecutor()
  );
  await commandlet.run();
}
