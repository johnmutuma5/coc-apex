"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// From https://github.com/redhat-developer/vscode-java
// Original version licensed under the Eclipse Public License (EPL)
const cp = require("child_process");
const coc_nvim_1 = require("coc.nvim");
const constants_1 = require("./constants");
const messages_1 = require("./messages");
const pathExists = require("path-exists");
// tslint:disable-next-line:no-var-requires
const expandHomeDir = require('expand-home-dir');
// tslint:disable-next-line:no-var-requires
const findJavaHome = require('find-java-home');
exports.JAVA_HOME_KEY = 'salesforcedx-vscode-apex.java.home';
exports.JAVA_MEMORY_KEY = 'salesforcedx-vscode-apex.java.memory';
/**
 * Resolves the requirements needed to run the extension.
 * Returns a promise that will resolve to a RequirementsData if all requirements are resolved.
 */
function resolveRequirements() {
    return __awaiter(this, void 0, void 0, function* () {
        const javaHome = yield checkJavaRuntime();
        const javaMemory = coc_nvim_1.workspace
            .getConfiguration()
            .get(exports.JAVA_MEMORY_KEY, null);
        yield checkJavaVersion(javaHome);
        return Promise.resolve({
            java_home: javaHome,
            java_memory: javaMemory
        });
    });
}
exports.resolveRequirements = resolveRequirements;
function checkJavaRuntime() {
    return new Promise((resolve, reject) => {
        let source;
        let javaHome = readJavaConfig();
        if (javaHome) {
            source = messages_1.nls.localize('source_java_home_setting_text');
        }
        else {
            javaHome = process.env['JDK_HOME'];
            if (javaHome) {
                source = messages_1.nls.localize('source_jdk_home_env_var_text');
            }
            else {
                javaHome = process.env['JAVA_HOME'];
                source = messages_1.nls.localize('source_java_home_env_var_text');
            }
        }
        if (javaHome) {
            javaHome = expandHomeDir(javaHome);
            if (!pathExists.sync(javaHome)) {
                return reject(messages_1.nls.localize('source_missing_text', source, constants_1.SET_JAVA_DOC_LINK));
            }
            return resolve(javaHome);
        }
        // Last resort, try to automatically detect
        findJavaHome((err, home) => {
            if (err) {
                return reject(messages_1.nls.localize('java_runtime_missing_text', constants_1.SET_JAVA_DOC_LINK));
            }
            else {
                return resolve(home);
            }
        });
    });
}
function readJavaConfig() {
    const config = coc_nvim_1.workspace.getConfiguration();
    return config.get('salesforcedx-vscode-apex.java.home', '');
}
function checkJavaVersion(javaHome) {
    return new Promise((resolve, reject) => {
        cp.execFile(javaHome + '/bin/java', ['-version'], {}, (error, stdout, stderr) => {
            if (stderr.indexOf('build 1.8') < 0 &&
                stderr.indexOf('build 11.') < 0) {
                reject(messages_1.nls.localize('wrong_java_version_text', constants_1.SET_JAVA_DOC_LINK));
            }
            else {
                resolve(true);
            }
        });
    });
}
