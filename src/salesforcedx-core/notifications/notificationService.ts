import { OutputChannel, workspace } from 'coc.nvim';
import {nls} from '../../salesforcedx-sobjects-faux-generator';
import {DEFAULT_SFDX_CHANNEL} from '../channels';

/**
 * A centralized location for all notification functionalities.
 */
export class NotificationService {
  private readonly channel: OutputChannel;
  private static instance: NotificationService;

  public constructor(channel?: OutputChannel) {
    this.channel = channel || DEFAULT_SFDX_CHANNEL;
  }

  public static getInstance(channel?: OutputChannel) {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(channel);
    }
    return NotificationService.instance;
  }

  public showFailedExecution(executionName: string) {
    this.showErrorMessage(
      nls.localize('notification_unsuccessful_execution_text', executionName)
    );
    this.showChannelOutput();
  }

  // private showCanceledExecution(executionName: string) {
  //   this.showWarningMessage(
  //     nls.localize('notification_canceled_execution_text', executionName)
  //   );
  //   this.showChannelOutput();
  // }

  // Prefer these over directly calling the vscode.show* functions
  // We can expand these to be facades that gather analytics of failures.

  public showErrorMessage(
    message: string,
    // ...items: string[]
  //): Thenable<string | undefined> {
  ): void  {
    // return vscode.window.showErrorMessage(message, ...items);
    return workspace.showMessage(message, 'error');
  }

  public showInformationMessage(
    message: string,
    // ...items: string[]
  //): Thenable<string | undefined> {
  ): void  {
    return workspace.showMessage(message, 'more');
  }

  public showWarningMessage(
    message: string,
    // ...items: string[]
  //): Thenable<string | undefined> {
  ): void  {
    // return vscode.window.showWarningMessage(message, ...items);
    return workspace.showMessage(message, 'warning');
  }

  // public showWarningModal(
  //   message: string,
  //   ...items: string[]
  // ): Thenable<string | undefined> {
  //   return vscode.window.showWarningMessage(message, { modal: true }, ...items);
  // }

  private showChannelOutput() {
    this.channel.show(true);
  }
}
