"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
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
const core_1 = require("@salesforce/core");
const path = require("path");
const defaultUserNameKey = 'defaultusername';
class ConfigUtil {
    static getUsername(projectPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultUserName = (yield this.getConfigValue(projectPath, defaultUserNameKey));
            const username = yield core_1.Aliases.fetch(defaultUserName);
            return Promise.resolve(username);
        });
    }
    static getConfigValue(projectPath, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myLocalConfig = yield core_1.ConfigFile.create({
                    isGlobal: false,
                    rootFolder: path.join(projectPath, '.sfdx'),
                    filename: 'sfdx-config.json'
                });
                const localValue = myLocalConfig.get(key);
                if (localValue) {
                    return localValue;
                }
                else {
                    const aggregator = yield core_1.ConfigAggregator.create();
                    const globalValue = aggregator.getPropertyValue(key);
                    if (globalValue) {
                        return globalValue;
                    }
                }
            }
            catch (err) {
                return undefined;
            }
            return undefined;
        });
    }
}
exports.ConfigUtil = ConfigUtil;
