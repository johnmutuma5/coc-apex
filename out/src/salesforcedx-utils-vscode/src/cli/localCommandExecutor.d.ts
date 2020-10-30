/// <reference types="node" />
import { EventEmitter } from 'events';
import 'rxjs/add/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { Command } from '.';
import { CancellationToken, CommandExecution } from './commandExecutor';
export declare class LocalCommandExecution implements CommandExecution {
    static readonly EXIT_EVENT = "exitEvent";
    static readonly ERROR_EVENT = "errorEvent";
    static readonly STDOUT_EVENT = "stdoutEvent";
    static readonly STDERR_EVENT = "stderrEvent";
    static readonly SUCCESS_CODE = 0;
    static readonly FAILURE_CODE = 1;
    readonly command: Command;
    readonly cancellationToken?: CancellationToken;
    readonly processExitSubject: Observable<number | undefined>;
    readonly processErrorSubject: Observable<Error | undefined>;
    readonly stdoutSubject: Observable<Buffer | string>;
    readonly stderrSubject: Observable<Buffer | string>;
    cmdEmitter: EventEmitter;
    constructor(command: Command);
}
