"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
function isInteger(value) {
    return (value !== undefined &&
        !/\D/.test(value) &&
        Number.isSafeInteger(Number.parseInt(value)));
}
exports.isInteger = isInteger;
function isIntegerInRange(value, range) {
    return (value !== undefined &&
        isInteger(value) &&
        Number.parseInt(value) >= range[0] &&
        Number.parseInt(value) <= range[1]);
}
exports.isIntegerInRange = isIntegerInRange;
function isAlphaNumString(value) {
    return value !== undefined && value !== '' && !/\W/.test(value);
}
exports.isAlphaNumString = isAlphaNumString;
function isRecordIdFormat(value = '', prefix) {
    return (isAlphaNumString(value) &&
        value.startsWith(prefix) &&
        (value.length === 15 || value.length === 18));
}
exports.isRecordIdFormat = isRecordIdFormat;
function isAlphaNumSpaceString(value) {
    return value !== undefined && /^\w+( *\w*)*$/.test(value);
}
exports.isAlphaNumSpaceString = isAlphaNumSpaceString;
