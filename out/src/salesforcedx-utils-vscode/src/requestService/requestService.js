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
const request_light_1 = require("request-light");
const constants_1 = require("../constants");
// Right now have POST and DELETE (out of Query, GET, POST, PATCH, DELETE),
// add any new ones needed as they are encountered. Note: when adding those
// it'll be the responsiblity of whomever added them to verify or change
// anything in the arguments for the call to deal with them.
var RestHttpMethodEnum;
(function (RestHttpMethodEnum) {
    RestHttpMethodEnum["Delete"] = "DELETE";
    RestHttpMethodEnum["Get"] = "GET";
    RestHttpMethodEnum["Post"] = "POST";
})(RestHttpMethodEnum = exports.RestHttpMethodEnum || (exports.RestHttpMethodEnum = {}));
class RequestService {
    constructor() {
        this._proxyStrictSSL = false;
        this._connectionTimeoutMs = constants_1.DEFAULT_CONNECTION_TIMEOUT_MS;
    }
    getEnvVars() {
        const envVars = Object.assign({}, process.env);
        const proxyUrl = this.proxyUrl;
        if (proxyUrl) {
            envVars['HTTP_PROXY'] = proxyUrl;
            envVars['HTTPS_PROXY'] = proxyUrl;
        }
        const instanceUrl = this.instanceUrl;
        if (instanceUrl) {
            envVars[constants_1.ENV_SFDX_INSTANCE_URL] = instanceUrl;
        }
        const sid = this.accessToken;
        if (sid) {
            envVars[constants_1.ENV_SFDX_DEFAULTUSERNAME] = sid;
        }
        return envVars;
    }
    get instanceUrl() {
        return this._instanceUrl;
    }
    set instanceUrl(instanceUrl) {
        this._instanceUrl = instanceUrl;
    }
    get accessToken() {
        return this._accessToken;
    }
    set accessToken(accessToken) {
        this._accessToken = accessToken;
    }
    get proxyUrl() {
        return this._proxyUrl;
    }
    set proxyUrl(proxyUrl) {
        this._proxyUrl = proxyUrl;
    }
    get proxyStrictSSL() {
        return this._proxyStrictSSL;
    }
    set proxyStrictSSL(proxyStrictSSL) {
        this._proxyStrictSSL = proxyStrictSSL;
    }
    get proxyAuthorization() {
        return this._proxyAuthorization;
    }
    set proxyAuthorization(proxyAuthorization) {
        this._proxyAuthorization = proxyAuthorization;
    }
    get connectionTimeoutMs() {
        return this._connectionTimeoutMs || constants_1.DEFAULT_CONNECTION_TIMEOUT_MS;
    }
    set connectionTimeoutMs(connectionTimeoutMs) {
        this._connectionTimeoutMs = connectionTimeoutMs;
    }
    // Execute defaults to POST
    execute(command, restHttpMethodEnum = RestHttpMethodEnum.Post) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.proxyUrl) {
                request_light_1.configure(this._proxyUrl, this._proxyStrictSSL);
            }
            const urlElements = [this.instanceUrl, command.getCommandUrl()];
            const requestUrl = command.getQueryString() == null
                ? urlElements.join('/')
                : urlElements.join('/').concat('?', command.getQueryString());
            const requestBody = command.getRequest();
            const options = {
                type: restHttpMethodEnum,
                url: requestUrl,
                timeout: this.connectionTimeoutMs,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Accept: 'application/json',
                    Authorization: `OAuth ${this.accessToken}`,
                    'Content-Length': requestBody
                        ? Buffer.byteLength(requestBody, 'utf-8')
                        : 0,
                    'Sforce-Call-Options': `client=${constants_1.CLIENT_ID}`
                },
                data: requestBody
            };
            if (this.proxyAuthorization) {
                options.headers['Proxy-Authorization'] = this.proxyAuthorization;
            }
            try {
                const response = yield this.sendRequest(options);
                return Promise.resolve(response.responseText);
            }
            catch (error) {
                const xhrResponse = error;
                return Promise.reject(xhrResponse.responseText);
            }
        });
    }
    sendRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return request_light_1.xhr(options);
        });
    }
}
exports.RequestService = RequestService;
