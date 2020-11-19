import {OutputChannel, workspace, Neovim} from "coc.nvim";
import stripAnsi = require("strip-ansi");
import {CommandExecution} from "../../salesforcedx-utils-vscode";

export const DEFAULT_SFDX_CHANNEL = workspace.createOutputChannel('SFDX-Output-Channel');

export class ChannelService {
  private readonly channel: OutputChannel;
  private static instance: ChannelService;

  public constructor(channel?: OutputChannel) {
    this.channel = channel || DEFAULT_SFDX_CHANNEL;
  }

  public static getInstance(channel?: OutputChannel) {
    if (!ChannelService.instance) {
      ChannelService.instance = new ChannelService(channel);
    }
    return ChannelService.instance;
  }

  public getChannelContent(): string {
    return this.channel.content;
  }

  public disposeChannel() {
    this.channel.dispose();
  }

  public streamCommandOutput(execution: CommandExecution) {
    this.streamCommandStartStop(execution);
    execution.stderrSubject.subscribe(data =>
      this.channel.append(stripAnsi(data.toString()))
    );
    execution.stdoutSubject.subscribe(data =>
      this.channel.append(stripAnsi(data.toString()))
    );
  }

  public streamCommandStartStop(execution: CommandExecution) {
    this.channel.append('CHANNEL START');
    this.channel.appendLine(execution.command.toString());
    this.channel.appendLine('');

    this.showCommandWithTimestamp(execution.command.toCommand());

    execution.processExitSubject.subscribe(data => {
      this.showCommandWithTimestamp(execution.command.toCommand());
      this.channel.append(' ');
      if (data !== undefined && data !== null) {
        this.channel.appendLine('CHANNEL END - Exit Code: ' + data.toString());
      } else {
        this.channel.appendLine('END');
      }
      this.channel.appendLine('');
    });

    execution.processErrorSubject.subscribe(data => {
      this.showCommandWithTimestamp(execution.command.toCommand());

      this.channel.append(' ');
      if (data !== undefined) {
        if (/sfdx.*ENOENT/.test(data.message)) {
          this.channel.appendLine( 'CHANNEL END - SFDX not found.');
        } else {
          this.channel.appendLine('CHANNEL END - Error: ' + data.message);
        }
      } else {
        // this.channel.appendLine(nls.localize('channel_end'));
        this.channel.appendLine('END');
      }
      this.channel.appendLine('');
    });
  }

  public showCommandWithTimestamp(commandName: string) {
    this.channel.appendLine(this.getExecutionTime() + ' ' + commandName);
  }

  private getExecutionTime() {
    const d = new Date();
    const hr = this.ensureDoubleDigits(d.getHours());
    const mins = this.ensureDoubleDigits(d.getMinutes());
    const sec = this.ensureDoubleDigits(d.getSeconds());
    const milli = d.getMilliseconds();
    return `${hr}:${mins}:${sec}.${milli}`;
  }

  private ensureDoubleDigits(num: number) {
    return num < 10 ? `0${num.toString()}` : num.toString();
  }

  public showChannelOutput() {
    this.channel.show(true);
  }

  public hideChannelOutput() {
    this.channel.hide();
  }

  public appendLine(text: string) {
    this.channel.appendLine(text);
  }
}
