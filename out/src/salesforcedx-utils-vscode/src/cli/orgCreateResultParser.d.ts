export interface OrgCreateSuccessResult {
    status: number;
    result: {
        orgId: string;
        username: string;
    };
}
export interface OrgCreateErrorResult {
    status: number;
    name: string;
    message: string;
    exitCode: number;
    commandName: string;
    stack: string;
    warnings: any[];
}
export declare class OrgCreateResultParser {
    private response;
    constructor(stdout: string);
    createIsSuccessful(): boolean;
    getResult(): OrgCreateSuccessResult | OrgCreateErrorResult;
}
