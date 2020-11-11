import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";
import {SfdxCommandlet} from "../../../salesforcedx-core";
import {ParametersGatherer, CancelResponse, ContinueResponse} from "../../../salesforcedx-utils-vscode";
import {workspace, Uri} from "coc.nvim";
import {SfdxCommandletExecutor} from '../../../salesforcedx-core/commands';
import {Command, SfdxCommandBuilder} from '../../../salesforcedx-utils-vscode/src/cli/commandBuilder';
import {getTempFolder} from '../utils';
import {getCurrentBufferBasename} from '../../../salesforcedx-core/utils/nvim';


interface ApexTestClass {
  name: string;
}

class TestClassSelector implements ParametersGatherer<ApexTestClass> {
  public async gather(): Promise<CancelResponse | ContinueResponse<ApexTestClass>> {
    const className = await getCurrentBufferBasename();
    return {
      type: 'CONTINUE',
      data: {
        name: className
      }
    }
  }
}

class ForceApexClassTestRunExecutor extends SfdxCommandletExecutor<ApexTestClass>{
  public build(data: ApexTestClass): Command {

    const outputToJson = getTempFolder();

    return new SfdxCommandBuilder()
      .withDescription('Running Unit Tests for: ' + data.name)
      .withArg('force:apex:test:run')
      .withFlag('--tests', data.name)
      .withFlag('--resultformat', 'human')
      .withFlag('--outputdir', outputToJson)
      .withFlag('--loglevel', 'error')
      .withLogName('force_apex_test_run_code_action')
      .build()
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new TestClassSelector();

export async function forceApexClassTestRun() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceApexClassTestRunExecutor()
  );
  await commandlet.run();
}

