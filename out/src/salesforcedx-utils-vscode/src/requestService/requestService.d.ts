import { XHROptions, XHRResponse } from 'request-light';
import { BaseCommand } from './baseCommand';
export declare enum RestHttpMethodEnum {
    Delete = "DELETE",
    Get = "GET",
    Post = "POST"
}
export declare class RequestService {
    private _instanceUrl;
    private _accessToken;
    private _proxyUrl;
    private _proxyStrictSSL;
    private _proxyAuthorization;
    private _connectionTimeoutMs;
    getEnvVars(): any;
    get instanceUrl(): string;
    set instanceUrl(instanceUrl: string);
    get accessToken(): string;
    set accessToken(accessToken: string);
    get proxyUrl(): string;
    set proxyUrl(proxyUrl: string);
    get proxyStrictSSL(): boolean;
    set proxyStrictSSL(proxyStrictSSL: boolean);
    get proxyAuthorization(): string;
    set proxyAuthorization(proxyAuthorization: string);
    get connectionTimeoutMs(): number;
    set connectionTimeoutMs(connectionTimeoutMs: number);
    execute(command: BaseCommand, restHttpMethodEnum?: RestHttpMethodEnum): Promise<string>;
    sendRequest(options: XHROptions): Promise<XHRResponse>;
}
