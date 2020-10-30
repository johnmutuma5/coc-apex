/// <reference types="node" />
import { ChildProcess, SpawnOptions } from 'child_process';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';
import { Command } from './';
export interface CancellationToken {
    isCancellationRequested: boolean;
}
export declare class GlobalCliEnvironment {
    static readonly environmentVariables: Map<string, string>;
}
export declare class CliCommandExecutor {
    protected static patchEnv(options: SpawnOptions, baseEnvironment: Map<string, string>): SpawnOptions;
    private readonly command;
    private readonly options;
    constructor(command: Command, options: SpawnOptions, inheritGlobalEnvironmentVariables?: boolean);
    execute(cancellationToken?: CancellationToken): CliCommandExecution;
}
export declare class CompositeCliCommandExecutor {
    private readonly command;
    constructor(commands: Command);
    execute(cancellationToken?: CancellationToken): CompositeCliCommandExecution;
}
/**
 * Represents a command execution (a process has already been spawned for it).
 * This is tightly coupled with the execution model (child_process).
 * If we ever use a different executor, this class should be refactored and abstracted
 * to take an event emitter/observable instead of child_proces.
 */
export interface CommandExecution {
    readonly command: Command;
    readonly cancellationToken?: CancellationToken;
    readonly processExitSubject: Observable<number | undefined>;
    readonly processErrorSubject: Observable<Error | undefined>;
    readonly stdoutSubject: Observable<Buffer | string>;
    readonly stderrSubject: Observable<Buffer | string>;
}
export declare class CompositeCliCommandExecution implements CommandExecution {
    readonly command: Command;
    readonly cancellationToken?: CancellationToken;
    readonly processExitSubject: Observable<number | undefined>;
    readonly processErrorSubject: Observable<Error | undefined>;
    readonly stdoutSubject: Observable<string>;
    readonly stderrSubject: Observable<string>;
    private readonly exitSubject;
    private readonly errorSubject;
    private readonly stdout;
    private readonly stderr;
    constructor(command: Command, cancellationToken?: CancellationToken);
    successfulExit(): void;
    failureExit(e?: {}): void;
}
export declare class CliCommandExecution implements CommandExecution {
    readonly command: Command;
    readonly cancellationToken?: CancellationToken;
    readonly processExitSubject: Observable<number | undefined>;
    readonly processErrorSubject: Observable<Error | undefined>;
    readonly stdoutSubject: Observable<Buffer | string>;
    readonly stderrSubject: Observable<Buffer | string>;
    private readonly childProcessPid;
    constructor(command: Command, childProcess: ChildProcess, cancellationToken?: CancellationToken);
    killExecution(signal?: string): Promise<void>;
}
