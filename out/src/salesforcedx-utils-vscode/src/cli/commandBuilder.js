"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(builder) {
        this.command = builder.command;
        this.description = builder.description;
        this.args = builder.args;
        this.logName = builder.logName;
    }
    toString() {
        return this.description
            ? this.description
            : `${this.command} ${this.args.join(' ')}`;
    }
    toCommand() {
        return `${this.command} ${this.args.join(' ')}`;
    }
}
exports.Command = Command;
class CommandBuilder {
    constructor(command) {
        this.args = [];
        this.command = command;
    }
    withDescription(description) {
        this.description = description;
        return this;
    }
    withArg(arg) {
        if (arg === '--json') {
            this.withJson();
        }
        else {
            this.args.push(arg);
        }
        return this;
    }
    withFlag(name, value) {
        this.args.push(name, value);
        return this;
    }
    withJson() {
        this.args.push('--json');
        this.args.push('--loglevel', 'fatal');
        return this;
    }
    withLogName(logName) {
        this.logName = logName;
        return this;
    }
    build() {
        return new Command(this);
    }
}
exports.CommandBuilder = CommandBuilder;
class SfdxCommandBuilder extends CommandBuilder {
    constructor() {
        super('sfdx');
    }
}
exports.SfdxCommandBuilder = SfdxCommandBuilder;
