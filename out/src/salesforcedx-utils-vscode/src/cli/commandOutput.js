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
class CommandOutput {
    constructor() {
        this.stdoutBuffer = '';
        this.stderrBuffer = '';
    }
    getCmdResult(execution) {
        return __awaiter(this, void 0, void 0, function* () {
            execution.stdoutSubject.subscribe(realData => {
                this.stdoutBuffer += realData.toString();
            });
            execution.stderrSubject.subscribe(realData => {
                this.stderrBuffer += realData.toString();
            });
            return new Promise((resolve, reject) => {
                execution.processExitSubject.subscribe(data => {
                    if (data !== undefined && String(data) === '0') {
                        return resolve(this.stdoutBuffer);
                    }
                    else {
                        return reject(this.stderrBuffer || this.stdoutBuffer);
                    }
                });
            });
        });
    }
}
exports.CommandOutput = CommandOutput;
