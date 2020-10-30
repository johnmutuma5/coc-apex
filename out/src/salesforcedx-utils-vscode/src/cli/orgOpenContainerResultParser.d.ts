export declare type OrgOpenSuccessResult = {
    status: number;
    result: {
        orgId: string;
        url: string;
        username: string;
    };
};
export declare type OrgOpenErrorResult = {
    status: number;
    name: string;
    message: string;
    exitCode: number;
    commandName: string;
    stack: string;
    warnings: any[];
};
export declare class OrgOpenContainerResultParser {
    private response;
    constructor(stdout: string);
    openIsSuccessful(): boolean;
    getResult(): OrgOpenSuccessResult | OrgOpenErrorResult;
}
