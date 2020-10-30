"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isNullOrUndefined(object) {
    if (object === null || object === undefined) {
        return true;
    }
    else {
        return false;
    }
}
exports.isNullOrUndefined = isNullOrUndefined;
function extractJsonObject(str) {
    const jsonString = str.substring(str.indexOf('{'), str.lastIndexOf('}') + 1);
    return JSON.parse(jsonString);
}
exports.extractJsonObject = extractJsonObject;
