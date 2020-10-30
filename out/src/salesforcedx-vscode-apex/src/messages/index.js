"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const salesforcedx_utils_vscode_1 = require("../../../salesforcedx-utils-vscode");
function loadMessageBundle(config) {
    function resolveFileName(locale) {
        return locale === salesforcedx_utils_vscode_1.DEFAULT_LOCALE
            ? `${salesforcedx_utils_vscode_1.BASE_FILE_NAME}.${salesforcedx_utils_vscode_1.BASE_FILE_EXTENSION}`
            : `${salesforcedx_utils_vscode_1.BASE_FILE_NAME}.${locale}.${salesforcedx_utils_vscode_1.BASE_FILE_EXTENSION}`;
    }
    const base = new salesforcedx_utils_vscode_1.Message(require(`./${resolveFileName(salesforcedx_utils_vscode_1.DEFAULT_LOCALE)}`).messages);
    if (config && config.locale && config.locale !== salesforcedx_utils_vscode_1.DEFAULT_LOCALE) {
        try {
            const layer = new salesforcedx_utils_vscode_1.Message(require(`./${resolveFileName(config.locale)}`).messages, base);
            return layer;
        }
        catch (e) {
            console.error(`Cannot find ${config.locale}, defaulting to en`);
            return base;
        }
    }
    else {
        return base;
    }
}
exports.nls = new salesforcedx_utils_vscode_1.Localization(loadMessageBundle(process.env.VSCODE_NLS_CONFIG
    ? JSON.parse(process.env.VSCODE_NLS_CONFIG)
    : undefined));
