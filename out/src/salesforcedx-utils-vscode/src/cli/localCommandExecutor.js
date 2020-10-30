"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
require("rxjs/add/observable/fromEvent");
const Observable_1 = require("rxjs/Observable");
class LocalCommandExecution {
    constructor(command) {
        // NOTE: ERROR_EVENT is NOT named 'error' because that causes the EventEmitter to actually
        // throw an exception IF there is no listener
        this.cmdEmitter = new events_1.EventEmitter();
        this.command = command;
        this.processExitSubject = Observable_1.Observable.fromEvent(this.cmdEmitter, LocalCommandExecution.EXIT_EVENT);
        this.processErrorSubject = Observable_1.Observable.fromEvent(this.cmdEmitter, LocalCommandExecution.ERROR_EVENT);
        this.stdoutSubject = Observable_1.Observable.fromEvent(this.cmdEmitter, LocalCommandExecution.STDOUT_EVENT);
        this.stderrSubject = Observable_1.Observable.fromEvent(this.cmdEmitter, LocalCommandExecution.STDERR_EVENT);
    }
}
exports.LocalCommandExecution = LocalCommandExecution;
LocalCommandExecution.EXIT_EVENT = 'exitEvent';
LocalCommandExecution.ERROR_EVENT = 'errorEvent';
LocalCommandExecution.STDOUT_EVENT = 'stdoutEvent';
LocalCommandExecution.STDERR_EVENT = 'stderrEvent';
LocalCommandExecution.SUCCESS_CODE = 0;
LocalCommandExecution.FAILURE_CODE = 1;
