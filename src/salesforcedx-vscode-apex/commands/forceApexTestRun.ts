import {SfdxCommandletExecutor, SfdxCommandlet} from "../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../salesforcedx-utils-vscode/cli/commandBuilder";
import {SfdxWorkspaceChecker} from "../../salesforcedx-core/commands/utils";
import {nls} from "../../salesforcedx-sobjects-faux-generator";
import {QuickPickItem} from "vscode";
import {ParametersGatherer, ContinueResponse, CancelResponse} from "../../salesforcedx-utils-vscode";
import {workspace} from "coc.nvim";
import {getTempFolder} from '../utils';

export enum TestType {
  All,
  Suite,
  Class
}

export interface ApexTestQuickPickItem extends QuickPickItem {
  type: TestType;
}


export class ForceApexTestRunCommandFactory {
  private data: ApexTestQuickPickItem;
  private getCodeCoverage: boolean;
  private builder: SfdxCommandBuilder = new SfdxCommandBuilder();
  private testRunExecutorCommand!: Command;
  private outputToJson: string;

  constructor(
    data: ApexTestQuickPickItem,
    getCodeCoverage: boolean,
    outputToJson: string
  ) {
    this.data = data;
    this.getCodeCoverage = getCodeCoverage;
    this.outputToJson = outputToJson;
  }

  public constructExecutorCommand(): Command {
    this.builder = this.builder
      .withDescription(nls.localize('force_apex_test_run_text'))
      .withArg('force:apex:test:run')
      .withLogName('force_apex_test_run');

    switch (this.data.type) {
      case TestType.Suite:
        this.builder = this.builder.withFlag(
          '--suitenames',
          `${this.data.label}`
        );
        break;
      case TestType.Class:
        this.builder = this.builder.withFlag(
          '--classnames',
          `${this.data.label}`
        );
        break;
      default:
        break;
    }

    if (this.getCodeCoverage) {
      this.builder = this.builder.withArg('--codecoverage');
    }

    this.builder = this.builder
      .withFlag('--resultformat', 'human')
      .withFlag('--outputdir', this.outputToJson)
      .withFlag('--loglevel', 'error');

    this.testRunExecutorCommand = this.builder.build();
    return this.testRunExecutorCommand;
  }
}

export class TestsSelector implements ParametersGatherer<ApexTestQuickPickItem> {
  public async gather(): Promise< CancelResponse | ContinueResponse<ApexTestQuickPickItem>
  > {
    const testQuickPickItems = [];
    const fileItems  = [];

    testQuickPickItems.push('All');
    fileItems.push({
      label: nls.localize('force_apex_test_run_all_test_label'),
      description: nls.localize(
        'force_apex_test_run_all_tests_description_text'
      ),
      type: TestType.All
    });

    // const selectionIndex = (await workspace.showQuickpick(testQuickPickItems));
    const selectionIndex = 0;
    const selection = fileItems[selectionIndex] as ApexTestQuickPickItem;
    const confirm = await workspace.showPrompt('Run all Apex tests?');

    return confirm
      ? { type: 'CONTINUE', data: selection }
      : { type: 'CANCEL' };
  }
}




export class ForceApexTestRunExecutor extends SfdxCommandletExecutor<ApexTestQuickPickItem> {
  public build(data: ApexTestQuickPickItem): Command {
    // const getCodeCoverage = sfdxCoreSettings.getRetrieveTestCodeCoverage();
    const getCodeCoverage = true;
    const outputToJson = getTempFolder();
    const factory: ForceApexTestRunCommandFactory = new ForceApexTestRunCommandFactory(
      data,
      getCodeCoverage,
      outputToJson
    );
    return factory.constructExecutorCommand();
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const parameterGatherer = new TestsSelector();

export async function forceApexTestRun() {
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceApexTestRunExecutor()
  );
  await commandlet.run();
}

