"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.DEBUGGER_LINE_BREAKPOINTS = 'debugger/lineBreakpoints';
exports.DEBUGGER_EXCEPTION_BREAKPOINTS = 'debugger/exceptionBreakpoints';
exports.LIGHT_BLUE_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'light', 'testNotRun.svg');
exports.LIGHT_RED_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'light', 'testFail.svg');
exports.LIGHT_GREEN_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'light', 'testPass.svg');
exports.LIGHT_ORANGE_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'light', 'testSkip.svg');
exports.DARK_BLUE_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'dark', 'testNotRun.svg');
exports.DARK_RED_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'dark', 'testFail.svg');
exports.DARK_GREEN_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'dark', 'testPass.svg');
exports.DARK_ORANGE_BUTTON = path.join(__filename, '..', '..', '..', 'resources', 'dark', 'testSkip.svg');
// const startPos = new vscode.Position(0, 0);
// const endPos = new vscode.Position(0, 1);
// export const APEX_GROUP_RANGE = new vscode.Range(startPos, endPos);
exports.SET_JAVA_DOC_LINK = 'https://forcedotcom.github.io/salesforcedx-vscode/articles/getting-started/java-setup';
exports.SFDX_APEX_CONFIGURATION_NAME = 'salesforcedx-vscode-apex';
exports.ENABLE_SOBJECT_REFRESH_ON_STARTUP = 'enable-sobject-refresh-on-startup';
