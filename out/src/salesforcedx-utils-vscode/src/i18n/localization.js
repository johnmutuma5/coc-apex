"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
exports.BASE_FILE_NAME = 'i18n';
exports.BASE_FILE_EXTENSION = 'js';
exports.DEFAULT_LOCALE = 'en';
exports.MISSING_LABEL_MSG = '!!! MISSING LABEL !!!';
class Localization {
    constructor(delegate) {
        this.delegate = delegate;
    }
    localize(label, ...args) {
        return this.delegate.localize(label, ...args);
    }
}
exports.Localization = Localization;
class Message {
    constructor(messages, delegate) {
        this.messages = messages;
        this.delegate = delegate;
    }
    localize(label, ...args) {
        let possibleLabel = this.getLabel(label);
        if (!possibleLabel) {
            console.warn(`Missing label for key: ${label}`);
            possibleLabel = `${exports.MISSING_LABEL_MSG} ${label}`;
            if (args.length >= 1) {
                args.forEach(arg => {
                    possibleLabel += ` (${arg})`;
                });
            }
            return possibleLabel;
        }
        if (args.length >= 1) {
            const expectedNumArgs = possibleLabel.split('%s').length - 1;
            if (args.length !== expectedNumArgs) {
                // just log it, we might want to hide some in some languges on purpose
                console.log(`Arguments do not match for label '${label}', got ${args.length} but want ${expectedNumArgs}`);
            }
            args.unshift(possibleLabel);
            return util.format.apply(util, args);
        }
        return possibleLabel;
    }
    getLabel(label) {
        if (this.messages[label]) {
            return this.messages[label];
        }
        else if (this.delegate) {
            return this.delegate.messages[label];
        }
        else {
            return undefined;
        }
    }
}
exports.Message = Message;
