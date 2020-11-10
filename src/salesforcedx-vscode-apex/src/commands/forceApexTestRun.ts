import * as path from 'path';
import * as fs from 'fs';
import {SfdxCommandletExecutor, SfdxCommandlet} from "../../../salesforcedx-core/commands";
import {Command, SfdxCommandBuilder} from "../../../salesforcedx-utils-vscode/src/cli/commandBuilder";
import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";
import {nls} from "../../../salesforcedx-sobjects-faux-generator";
import {QuickPickItem} from "vscode";
import {ParametersGatherer, ContinueResponse, CancelResponse, TestRunner} from "../../../salesforcedx-utils-vscode";
import {workspace, Neovim} from "coc.nvim";
import {hasRootWorkspace, getRootWorkspacePath} from '../../../salesforcedx-core/utils';
import {findFiles} from '../utils';

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
    // const testSuites = await workspace.findFiles('**/*.testSuite-meta.xml');
    const testSuites = await findFiles('**/*.testSuite-meta.xml', '**/node_modules/**');
    const fileItems = testSuites.map(testSuite => {
      const label = path.basename(testSuite.toString()).replace('.testSuite-meta.xml', '');
      testQuickPickItems.push(label);
      return {
        label,
        description: testSuite.fsPath,
        type: TestType.Suite
      };
    });

    // const apexClasses = await workspace.findFiles('**/*.cls');
    const apexClasses = await findFiles('**/*.cls', '**/node_modules/**');
    apexClasses.forEach(apexClass => {
      const fd = fs.openSync(apexClass.fsPath, 'r');
      const fileContent = fs.readFileSync(apexClass.fsPath).toString();
      fs.closeSync(fd);

      if (fileContent && fileContent.toLowerCase().includes('@istest')) {
        const label = path.basename(apexClass.toString()).replace('.cls', '');
        testQuickPickItems.push(label);
        fileItems.push({
          label,
          description: apexClass.fsPath,
          type: TestType.Class
        });
      }
    });

    testQuickPickItems.push('All');
    fileItems.push({
      label: nls.localize('force_apex_test_run_all_test_label'),
      description: nls.localize(
        'force_apex_test_run_all_tests_description_text'
      ),
      type: TestType.All
    });

    const selectionIndex = (await workspace.showQuickpick(testQuickPickItems));
    const selection = fileItems[selectionIndex] as ApexTestQuickPickItem;

    return selection
      ? { type: 'CONTINUE', data: selection }
      : { type: 'CANCEL' };
  }
}

function getTempFolder(): string {
  if (hasRootWorkspace()) {
    const apexDir = new TestRunner().getTempFolder(
      getRootWorkspacePath(),
      'apex'
    );
    return apexDir;
  } else {
    throw new Error(nls.localize('cannot_determine_workspace'));
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

