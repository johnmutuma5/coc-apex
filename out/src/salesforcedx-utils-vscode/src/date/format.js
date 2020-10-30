"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
function getYYYYMMddHHmmssDateFormat(localUTCDate) {
    const month2Digit = makeDoubleDigit(localUTCDate.getMonth() + 1);
    const date2Digit = makeDoubleDigit(localUTCDate.getDate());
    const hour2Digit = makeDoubleDigit(localUTCDate.getHours());
    const mins2Digit = makeDoubleDigit(localUTCDate.getMinutes());
    const sec2Digit = makeDoubleDigit(localUTCDate.getSeconds());
    return `${localUTCDate.getFullYear()}${month2Digit}${date2Digit}${hour2Digit}${mins2Digit}${sec2Digit}`;
}
exports.getYYYYMMddHHmmssDateFormat = getYYYYMMddHHmmssDateFormat;
function makeDoubleDigit(currentDigit) {
    return ('0' + currentDigit).slice(-2);
}
exports.makeDoubleDigit = makeDoubleDigit;
exports.optionYYYYMMddHHmmss = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};
exports.optionHHmm = {
    hour: '2-digit',
    minute: '2-digit'
};
exports.optionMMddYYYY = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
};
