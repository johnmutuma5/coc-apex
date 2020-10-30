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
const commandBuilder_1 = require("./commandBuilder");
const commandExecutor_1 = require("./commandExecutor");
const commandOutput_1 = require("./commandOutput");
class ForceOrgDisplay {
    getOrgInfo(projectPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = new commandExecutor_1.CliCommandExecutor(new commandBuilder_1.SfdxCommandBuilder()
                .withArg('force:org:display')
                .withJson()
                .build(), { cwd: projectPath }).execute();
            const cmdOutput = new commandOutput_1.CommandOutput();
            const result = yield cmdOutput.getCmdResult(execution);
            try {
                const orgInfo = JSON.parse(result).result;
                return Promise.resolve(orgInfo);
            }
            catch (e) {
                return Promise.reject(result);
            }
        });
    }
}
exports.ForceOrgDisplay = ForceOrgDisplay;
