"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
class PredicateResponse {
    constructor(result, message) {
        this.result = result;
        this.message = message;
    }
    static of(result, message) {
        return new PredicateResponse(result, message);
    }
    static true() {
        return new PredicateResponse(true, '');
    }
    static false() {
        return new PredicateResponse(false, 'GENERAL ERROR');
    }
}
exports.PredicateResponse = PredicateResponse;
