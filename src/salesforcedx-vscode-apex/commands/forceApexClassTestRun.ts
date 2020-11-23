import {SfdxCommandlet} from "../../salesforcedx-core";
import {ParametersGatherer, CancelResponse, ContinueResponse} from "../../salesforcedx-utils-vscode";
import {SfdxApexTestCommandletExecutor} from '../../salesforcedx-core/commands';
import {getCurrentBufferBasename} from '../../salesforcedx-core/utils/nvim';
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";


interface ApexTestClass {
  name: string;
}

class TestClassSelector implements ParametersGatherer<ApexTestClass> {
  public async gather(): Promise<CancelResponse | ContinueResponse<ApexTestClass>> {
    return {
      type: 'CONTINUE',
      data: {
        name: await getCurrentBufferBasename()
      }
    }
  }
}

class ForceApexClassTestRunExecutor extends SfdxApexTestCommandletExecutor<ApexTestClass>{
  public getTestName(data: ApexTestClass): string {
    return data.name;
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

