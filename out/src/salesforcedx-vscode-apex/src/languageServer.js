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
const fs = require("fs");
const path = require("path");
const coc_nvim_1 = require("coc.nvim");
const messages_1 = require("./messages");
const requirements = require("./requirements");
// import { telemetryService } from './telemetry';
const UBER_JAR_NAME = 'apex-jorje-lsp.jar';
// const JDWP_DEBUG_PORT = 2739;
const APEX_LANGUAGE_SERVER_MAIN = 'apex.jorje.lsp.ApexLanguageServerLauncher';
// declare var v8debug: any;
// const DEBUG = typeof v8debug === 'object' || startedInDebugMode();
function createServer(context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            deleteDbIfExists();
            const requirementsData = yield requirements.resolveRequirements();
            const uberJar = path.resolve(context.extensionPath, 'apex-lsp', UBER_JAR_NAME);
            const javaExecutable = path.resolve(`${requirementsData.java_home}/bin/java`);
            // const jvmMaxHeap = requirementsData.java_memory;
            // const enableSemanticErrors: boolean = workspace
            //   .getConfiguration()
            //   .get<boolean>('salesforcedx-vscode-apex.enable-semantic-errors', false);
            // const enableCompletionStatistics: boolean = workspace
            //   .getConfiguration()
            //   .get<boolean>(
            //     'salesforcedx-vscode-apex.advanced.enable-completion-statistics',
            //     false
            //   );
            const args = [
                '-cp',
                uberJar,
                '-Ddebug.internal.errors=true',
                // `-Ddebug.semantic.errors=${enableSemanticErrors}`,
                // `-Ddebug.completion.statistics=${enableCompletionStatistics}`
                APEX_LANGUAGE_SERVER_MAIN
            ];
            // if (jvmMaxHeap) {
            //   args.push(`-Xmx${jvmMaxHeap}M`);
            // }
            // if (DEBUG) {
            //   args.push(
            //     '-Dtrace.protocol=false',
            //     `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=${JDWP_DEBUG_PORT},quiet=y`
            //   );
            // }
            // args.push(APEX_LANGUAGE_SERVER_MAIN);
            return {
                options: {
                    env: process.env,
                    stdio: 'pipe'
                },
                command: javaExecutable,
                args,
            };
        }
        catch (err) {
            coc_nvim_1.workspace.showMessage(err);
            // telemetryService.sendApexLSPError(err);
            throw err;
        }
    });
}
function deleteDbIfExists() {
    if (coc_nvim_1.workspace.workspaceFolders &&
        coc_nvim_1.workspace.workspaceFolders[0]) {
        const dbPath = path.join(coc_nvim_1.Uri.parse(coc_nvim_1.workspace.workspaceFolder.uri).fsPath, '.sfdx', 'tools', 'apex.db');
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    }
}
// function startedInDebugMode(): boolean {
//   const args = (process as any).execArgv;
//   if (args) {
//     return args.some(
//       (arg: any) =>
//         /^--debug=?/.test(arg) ||
//         /^--debug-brk=?/.test(arg) ||
//         /^--inspect=?/.test(arg) ||
//         /^--inspect-brk=?/.test(arg)
//     );
//   }
//   return false;
// }
// See https://github.com/Microsoft/vscode-languageserver-node/issues/105
// export function code2ProtocolConverter(value: Uri) {
//   if (/^win32/.test(process.platform)) {
//     // The *first* : is also being encoded which is not the standard for URI on Windows
//     // Here we transform it back to the standard way
//     return value.toString().replace('%3A', ':');
//   } else {
//     return value.toString();
//   }
// }
// function protocol2CodeConverter(value: string) {
//   return Uri.parse(value);
// }
function createLanguageServer(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientOptions = {
            // Register the server for Apex documents
            documentSelector: [{ language: 'apexcode', scheme: 'file' }],
            synchronize: {
                configurationSection: 'apexcode',
                fileEvents: [
                    coc_nvim_1.workspace.createFileSystemWatcher('**/*.cls'),
                    coc_nvim_1.workspace.createFileSystemWatcher('**/*.trigger'),
                    coc_nvim_1.workspace.createFileSystemWatcher('**/sfdx-project.json') // SFDX workspace configuration file
                ]
            },
        };
        const server = yield createServer(context);
        const client = new coc_nvim_1.LanguageClient('apexcode', messages_1.nls.localize('client_name'), server, clientOptions);
        // client.onTelemetry(data =>
        //   telemetryService.sendApexLSPLog(data.properties, data.measures)
        // );
        return client;
    });
}
exports.createLanguageServer = createLanguageServer;
