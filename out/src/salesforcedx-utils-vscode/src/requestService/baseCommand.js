"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
class BaseCommand {
    constructor(queryString) {
        this.queryString = queryString;
    }
    getQueryString() {
        return this.queryString;
    }
}
exports.BaseCommand = BaseCommand;
