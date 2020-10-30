"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
class OrgOpenContainerResultParser {
    constructor(stdout) {
        try {
            const sanitized = stdout.substring(stdout.indexOf('{'), stdout.lastIndexOf('}') + 1);
            this.response = JSON.parse(sanitized);
        }
        catch (e) {
            const err = new Error('Error parsing org open result');
            err.name = 'OrgOpenContainerParserFail';
            throw err;
        }
    }
    openIsSuccessful() {
        return this.response && this.response.status === 0 ? true : false;
    }
    getResult() {
        if (this.openIsSuccessful()) {
            return this.response;
        }
        return this.response;
    }
}
exports.OrgOpenContainerResultParser = OrgOpenContainerResultParser;
