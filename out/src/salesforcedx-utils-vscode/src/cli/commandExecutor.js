"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_spawn = require("cross-spawn");
const os = require("os");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/observable/interval");
const Observable_1 = require("rxjs/Observable");
const Subject_1 = require("rxjs/Subject");
// tslint:disable-next-line:no-var-requires
const kill = require('tree-kill');
class GlobalCliEnvironment {
}
exports.GlobalCliEnvironment = GlobalCliEnvironment;
GlobalCliEnvironment.environmentVariables = new Map();
class CliCommandExecutor {
    constructor(command, options, inheritGlobalEnvironmentVariables = true) {
        this.command = command;
        this.options = inheritGlobalEnvironmentVariables
            ? CliCommandExecutor.patchEnv(options, GlobalCliEnvironment.environmentVariables)
            : options;
    }
    static patchEnv(options, baseEnvironment) {
        // start with current process environment
        const env = Object.create(null);
        // inherit current process environment
        Object.assign(env, process.env);
        // now push anything from global environment
        baseEnvironment.forEach((value, key) => {
            env[key] = value;
        });
        // telemetry header
        if (env) {
            env.SFDX_TOOL = 'salesforce-vscode-extensions';
        }
        // then specific environment from Spawn Options
        if (typeof options.env !== 'undefined') {
            Object.assign(env, options.env);
        }
        options.env = env;
        return options;
    }
    execute(cancellationToken) {
        const childProcess = cross_spawn(this.command.command, this.command.args, this.options);
        return new CliCommandExecution(this.command, childProcess, cancellationToken);
    }
}
exports.CliCommandExecutor = CliCommandExecutor;
class CompositeCliCommandExecutor {
    constructor(commands) {
        this.command = commands;
    }
    execute(cancellationToken) {
        return new CompositeCliCommandExecution(this.command, cancellationToken);
    }
}
exports.CompositeCliCommandExecutor = CompositeCliCommandExecutor;
class CompositeCliCommandExecution {
    constructor(command, cancellationToken) {
        this.exitSubject = new Subject_1.Subject();
        this.errorSubject = new Subject_1.Subject();
        this.stdout = new Subject_1.Subject();
        this.stderr = new Subject_1.Subject();
        this.command = command;
        this.cancellationToken = cancellationToken;
        this.processExitSubject = this.exitSubject.asObservable();
        this.processErrorSubject = this.errorSubject.asObservable();
        this.stdoutSubject = this.stdout.asObservable();
        this.stderrSubject = this.stderr.asObservable();
        let timerSubscriber;
        if (cancellationToken) {
            const timer = Observable_1.Observable.interval(1000);
            timerSubscriber = timer.subscribe((next) => __awaiter(this, void 0, void 0, function* () {
                if (cancellationToken.isCancellationRequested) {
                    try {
                        this.exitSubject.next();
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }));
        }
        this.processErrorSubject.subscribe(next => {
            if (timerSubscriber) {
                timerSubscriber.unsubscribe();
            }
        });
        this.processExitSubject.subscribe(next => {
            if (timerSubscriber) {
                timerSubscriber.unsubscribe();
            }
        });
    }
    successfulExit() {
        this.exitSubject.next(0);
    }
    failureExit(e) {
        if (e) {
            this.stderr.next(`${e}${os.EOL}`);
        }
        this.exitSubject.next(1);
    }
}
exports.CompositeCliCommandExecution = CompositeCliCommandExecution;
class CliCommandExecution {
    constructor(command, childProcess, cancellationToken) {
        this.command = command;
        this.cancellationToken = cancellationToken;
        this.childProcessPid = childProcess.pid;
        let timerSubscriber;
        // Process
        this.processExitSubject = Observable_1.Observable.fromEvent(childProcess, 'exit');
        this.processExitSubject.subscribe(next => {
            if (timerSubscriber) {
                timerSubscriber.unsubscribe();
            }
        });
        this.processErrorSubject = Observable_1.Observable.fromEvent(childProcess, 'error');
        this.processErrorSubject.subscribe(next => {
            if (timerSubscriber) {
                timerSubscriber.unsubscribe();
            }
        });
        // Output
        this.stdoutSubject = Observable_1.Observable.fromEvent(childProcess.stdout, 'data');
        this.stderrSubject = Observable_1.Observable.fromEvent(childProcess.stderr, 'data');
        // Cancellation watcher
        if (cancellationToken) {
            const timer = Observable_1.Observable.interval(1000);
            timerSubscriber = timer.subscribe((next) => __awaiter(this, void 0, void 0, function* () {
                if (cancellationToken.isCancellationRequested) {
                    try {
                        yield this.killExecution();
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }));
        }
    }
    killExecution(signal = 'SIGKILL') {
        return __awaiter(this, void 0, void 0, function* () {
            return killPromise(this.childProcessPid, signal);
        });
    }
}
exports.CliCommandExecution = CliCommandExecution;
/**
 * This is required because of https://github.com/nodejs/node/issues/6052
 * Basically if a child process spawns it own children  processes, those
 * children (grandchildren) processes are not necessarily killed
 */
function killPromise(processId, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            kill(processId, signal, (err) => {
                err ? reject(err) : resolve();
            });
        });
    });
}
