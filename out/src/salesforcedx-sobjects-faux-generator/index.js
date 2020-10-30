"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
var constants_1 = require("./src/constants");
exports.CLIENT_ID = constants_1.CLIENT_ID;
exports.SFDX_DIR = constants_1.SFDX_DIR;
exports.SOBJECTS_DIR = constants_1.SOBJECTS_DIR;
exports.TOOLS_DIR = constants_1.TOOLS_DIR;
__export(require("./src/describe"));
__export(require("./src/messages"));
__export(require("./src/generator"));
