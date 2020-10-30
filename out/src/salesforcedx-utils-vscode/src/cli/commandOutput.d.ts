import { CommandExecution } from './commandExecutor';
export declare class CommandOutput {
    private stdoutBuffer;
    private stderrBuffer;
    getCmdResult(execution: CommandExecution): Promise<string>;
}
