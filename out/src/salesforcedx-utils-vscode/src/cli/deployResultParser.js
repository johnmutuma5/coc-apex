"use strict";
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
exports.CONFLICT_ERROR_NAME = 'sourceConflictDetected';
class ForceDeployResultParser {
    constructor(stdout) {
        try {
            this.response = helpers_1.extractJsonObject(stdout);
        }
        catch (e) {
            const err = new Error('Error parsing deploy result');
            err.name = 'DeployParserFail';
            throw err;
        }
    }
    getErrors() {
        if (this.response.status === 1) {
            return this.response;
        }
    }
    getSuccesses() {
        const { status, result, partialSuccess } = this.response;
        if (status === 0) {
            const { pushedSource } = result;
            if (pushedSource) {
                return { status, result: { deployedSource: pushedSource } };
            }
            return this.response;
        }
        if (partialSuccess) {
            return { status, result: { deployedSource: partialSuccess } };
        }
    }
    hasConflicts() {
        return (this.response.status === 1 && this.response.name === exports.CONFLICT_ERROR_NAME);
    }
}
exports.ForceDeployResultParser = ForceDeployResultParser;
