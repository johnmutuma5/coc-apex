"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class DiffResultParser {
    constructor(stdout) {
        try {
            this.response = helpers_1.extractJsonObject(stdout);
        }
        catch (e) {
            const err = new Error('Error parsing diff result');
            err.name = 'DiffResultParserFail';
            throw err;
        }
    }
    isSuccessful() {
        return this.response && this.response.status === 0 ? true : false;
    }
    getSuccessResponse() {
        if (this.isSuccessful()) {
            return this.response;
        }
    }
    getErrorResponse() {
        if (!this.isSuccessful()) {
            return this.response;
        }
    }
}
exports.DiffResultParser = DiffResultParser;
