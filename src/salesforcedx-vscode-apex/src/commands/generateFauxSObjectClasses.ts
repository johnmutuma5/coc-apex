import {SfdxCommandBuilder, ParametersGatherer, ContinueResponse, LocalCommandExecution, CancelResponse} from "../../../salesforcedx-utils-vscode";
import {SObjectRefreshSource, nls, FauxClassGenerator, SObjectCategory} from "../../../salesforcedx-sobjects-faux-generator";
import {SfdxCommandletExecutor, SfdxCommandlet} from "../../../salesforcedx-core/commands";
import {Command} from "../../../salesforcedx-utils-vscode/src/cli/commandBuilder";
import {notificationService} from "../../../salesforcedx-core/notifications";
import {CancellationTokenSource} from "vscode-languageserver-protocol";
import {channelService} from "../../../salesforcedx-core/channels";
import {getRootWorkspacePath} from "../../../salesforcedx-core/utils";
import {workspace} from "coc.nvim";
import {SfdxWorkspaceChecker} from "../../../salesforcedx-core/commands/utils";

const sfdxWorkspaceChecker = new SfdxWorkspaceChecker();
export async function forceGenerateFauxClassesCreate(
    source?: SObjectRefreshSource
) {
  const parameterGatherer = new SObjectRefreshGatherer(source);
  const commandlet = new SfdxCommandlet(
    sfdxWorkspaceChecker,
    parameterGatherer,
    new ForceGenerateFauxClassesExecutor()
  );
  await commandlet.run();
}

export type RefreshSelection = {
  category: SObjectCategory;
  source: SObjectRefreshSource;
};

export class SObjectRefreshGatherer implements ParametersGatherer<RefreshSelection> {
  private source?: SObjectRefreshSource;

  public constructor(source?: SObjectRefreshSource) {
    this.source = source;
  }

  public async gather(): Promise<ContinueResponse<RefreshSelection> | CancelResponse>{
    let category = SObjectCategory.ALL;
    if (!this.source || this.source === SObjectRefreshSource.Manual) {
      const options = [
        'All',
        'Custom',
        'Standard'
      ];
      const choice = await workspace.showQuickpick(options);
      switch (choice) {
        case 0:
          category = SObjectCategory.ALL;
          break;
        case 1:
          category = SObjectCategory.CUSTOM;
          break;
        case 2:
          category = SObjectCategory.STANDARD;
          break;
        default:
          return { type: 'CANCEL' };
      }
    }
    return {
      type: 'CONTINUE',
      data: {
        category,
        source: this.source || SObjectRefreshSource.Manual
      }
    };
  }
}

export class ForceGenerateFauxClassesExecutor extends SfdxCommandletExecutor<{}> {
  private static isActive = false;
  public build(data: {}): Command {
    return new SfdxCommandBuilder()
      .withDescription(nls.localize('force_sobjects_refresh'))
      .withArg('sobject definitions refresh')
      .withLogName('force_generate_faux_classes_create')
      .build();
  }

  public async execute(
    response: ContinueResponse<RefreshSelection>
  ): Promise<void> {
    if (ForceGenerateFauxClassesExecutor.isActive) {
      notificationService.showErrorMessage(
        nls.localize('force_sobjects_no_refresh_if_already_active_error_text')
      );
      return;
    }
    const startTime = process.hrtime();
    ForceGenerateFauxClassesExecutor.isActive = true;
    const cancellationTokenSource = new CancellationTokenSource();
    const cancellationToken = cancellationTokenSource.token;
    const execution = new LocalCommandExecution(this.build(response.data));

    channelService.streamCommandOutput(execution);

    if (this.showChannelOutput) {
      channelService.showChannelOutput();
    }

    // notificationService.reportCommandExecutionStatus(
    //   execution,
    //   cancellationToken
    // );

    // let progressLocation = ProgressLocation.Notification;
    // if (response.data.source !== SObjectRefreshSource.Manual) {
    //   progressLocation = ProgressLocation.Window;
    // }
    // ProgressNotification.show(
    //   execution,
    //   cancellationTokenSource,
    //   progressLocation
    // );

    // taskViewService.addCommandExecution(execution, cancellationTokenSource);

    const gen: FauxClassGenerator = new FauxClassGenerator(
      execution.cmdEmitter,
      cancellationToken
    );

    // const commandName = execution.command.logName;
    try {
      let result;
      // if (response.data.source === SObjectRefreshSource.StartupMin) {
      if (false) {
        // result = await gen.generateMin(
        //   // vscode.workspace.workspaceFolders![0].uri.fsPath,
        //   getRootWorkspacePath(),
        //   response.data.source
        // );
      } else {
        result = await gen.generate(
          getRootWorkspacePath(),
          response.data.category,
          response.data.source
        );
      }

      // this.logMetric(commandName, startTime, result.data);
    } catch (result) {
      console.log('Generate error ' + result.error);
      // const commandData = {
      //   commandName,
      //   executionTime: telemetryService.getEndHRTime(startTime)
      // };
      // telemetryService.sendErrorEvent(
      //   result.error,
      //   Object.assign(result.data, commandData)
      // );
    }

    ForceGenerateFauxClassesExecutor.isActive = false;
    return;
  }
}

