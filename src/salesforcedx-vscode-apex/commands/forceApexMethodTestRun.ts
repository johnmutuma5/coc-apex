import {SfdxCommandlet} from "../../salesforcedx-core";
import {CancelResponse, ContinueResponse} from "../../salesforcedx-utils-vscode";
import {SfdxApexTestCommandletExecutor} from "../../salesforcedx-core/commands";
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {getCurrentBufferBasename, getCurrentLine} from "../../salesforcedx-core/utils/nvim";

interface ApexTestMethod {
  testClass: string;
  testMethod: string;
}

class TestMethodSelector {
  async gather(): Promise<CancelResponse | ContinueResponse<ApexTestMethod>> {
    const currentLine = (await getCurrentLine());
    console.log('Current Line: ', currentLine);
    const testMethod = currentLine.match(/void\s+(\w+)\s*\(/i)[1];

    return {
      type: 'CONTINUE',
      data: {
        testClass: await getCurrentBufferBasename(),
        testMethod
      }
    };
  }
}

class ForceApexMethodTestRunExecutor extends SfdxApexTestCommandletExecutor<ApexTestMethod>{
  public getTestName(data: ApexTestMethod): string {
    return `${data.testClass}.${data.testMethod}`;
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new TestMethodSelector();

export async function forceApexMethodTestRun() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceApexMethodTestRunExecutor()
  );
  await commandlet.run();
}
