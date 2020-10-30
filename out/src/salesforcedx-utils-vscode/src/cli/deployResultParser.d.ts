export declare const CONFLICT_ERROR_NAME = "sourceConflictDetected";
export interface DeployResult {
    columnNumber?: string;
    error?: string;
    filePath: string;
    fullName?: string;
    lineNumber?: string;
    state?: string;
    type: string;
}
export interface ForceSourceDeployErrorResponse {
    message: string;
    name: string;
    result: DeployResult[];
    stack: string;
    status: number;
    warnings: any[];
}
export interface ForceSourceDeploySuccessResponse {
    status: number;
    result: {
        deployedSource: DeployResult[];
    };
}
export declare class ForceDeployResultParser {
    private response;
    constructor(stdout: string);
    getErrors(): ForceSourceDeployErrorResponse | undefined;
    getSuccesses(): ForceSourceDeploySuccessResponse | undefined;
    hasConflicts(): boolean;
}
