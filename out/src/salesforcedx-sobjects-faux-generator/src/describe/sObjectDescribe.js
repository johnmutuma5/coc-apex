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
const salesforcedx_utils_vscode_1 = require("../../../salesforcedx-utils-vscode");
const constants_1 = require("../constants");
var SObjectCategory;
(function (SObjectCategory) {
    SObjectCategory["ALL"] = "ALL";
    SObjectCategory["STANDARD"] = "STANDARD";
    SObjectCategory["CUSTOM"] = "CUSTOM";
})(SObjectCategory = exports.SObjectCategory || (exports.SObjectCategory = {}));
class ForceListSObjectSchemaExecutor {
    build(type) {
        return new salesforcedx_utils_vscode_1.SfdxCommandBuilder()
            .withArg('force:schema:sobject:list')
            .withFlag('--sobjecttypecategory', type)
            .withJson()
            .build();
    }
    execute(projectPath, type) {
        const execution = new salesforcedx_utils_vscode_1.CliCommandExecutor(this.build(type), {
            cwd: projectPath
        }).execute();
        return execution;
    }
}
exports.ForceListSObjectSchemaExecutor = ForceListSObjectSchemaExecutor;
class SObjectDescribe {
    constructor(connection) {
        this.servicesPath = 'services/data';
        // the targetVersion should be consistent with the Cli even if only using REST calls
        this.targetVersion = '46.0';
        this.versionPrefix = 'v';
        this.sobjectsPart = 'sobjects';
        this.batchPart = 'composite/batch';
        this.connection = connection;
    }
    describeGlobal(projectPath, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const forceListSObjectSchemaExecutor = new ForceListSObjectSchemaExecutor();
            const execution = forceListSObjectSchemaExecutor.execute(projectPath, type);
            const cmdOutput = new salesforcedx_utils_vscode_1.CommandOutput();
            let result;
            try {
                result = yield cmdOutput.getCmdResult(execution);
            }
            catch (e) {
                return Promise.reject(e);
            }
            try {
                const sobjects = salesforcedx_utils_vscode_1.extractJsonObject(result).result;
                return Promise.resolve(sobjects);
            }
            catch (e) {
                return Promise.reject(result);
            }
        });
    }
    buildSObjectDescribeURL(sObjectName) {
        const urlElements = [
            this.getVersion(),
            this.sobjectsPart,
            sObjectName,
            'describe'
        ];
        return urlElements.join('/');
    }
    buildBatchRequestURL() {
        const batchUrlElements = [
            this.connection.instanceUrl,
            this.servicesPath,
            this.getVersion(),
            this.batchPart
        ];
        return batchUrlElements.join('/');
    }
    buildBatchRequestBody(types, nextToProcess) {
        const batchSize = 25;
        const batchRequest = { batchRequests: [] };
        for (let i = nextToProcess; i < nextToProcess + batchSize && i < types.length; i++) {
            batchRequest.batchRequests.push({
                method: 'GET',
                url: this.buildSObjectDescribeURL(types[i])
            });
        }
        return batchRequest;
    }
    runRequest(batchRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connection.request({
                method: 'POST',
                url: this.buildBatchRequestURL(),
                body: JSON.stringify(batchRequest),
                headers: {
                    'User-Agent': 'salesforcedx-extension',
                    'Sforce-Call-Options': `client=${constants_1.CLIENT_ID}`
                }
            });
        });
    }
    describeSObjectBatch(types, nextToProcess) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const batchRequest = this.buildBatchRequestBody(types, nextToProcess);
                const batchResponse = yield this.runRequest(batchRequest);
                const fetchedObjects = [];
                let i = nextToProcess;
                for (const sr of batchResponse.results) {
                    if (sr.result instanceof Array) {
                        if (sr.result[0].errorCode && sr.result[0].message) {
                            console.log(`Error: ${sr.result[0].message} - ${types[i]}`);
                        }
                    }
                    i++;
                    fetchedObjects.push(sr.result);
                }
                return Promise.resolve(fetchedObjects);
            }
            catch (error) {
                const errorMsg = error.hasOwnProperty('body')
                    ? error.body
                    : error.message;
                return Promise.reject(errorMsg);
            }
        });
    }
    getVersion() {
        return `${this.versionPrefix}${this.targetVersion}`;
    }
}
exports.SObjectDescribe = SObjectDescribe;
