/**
 * Interface that stores information about a successful diff operation
 */
export interface DiffSuccessResponse {
    /**
     * Request status e.g. 0 = Success
     */
    status: number;
    /**
     * Object that contains the successful result
     */
    result: {
        /**
         * Provides the location to the cached file retrieved from the org
         */
        remote: string;
        /**
         * Provides the location to the file provided by the user in --sourcepath
         */
        local: string;
        /**
         * Name of the file being diffed
         */
        fileName: string;
    };
}
/**
 * Interface that stores information about an unsuccessful diff operation
 */
export interface DiffErrorResponse {
    /**
     * Name of the command that was executed e.g. Diff
     */
    commandName: string;
    /**
     * Exit code provided by the command e.g. 1
     */
    exitCode: number;
    /**
     * Error message provided by the command e.g. The path could not be found.
     */
    message: string;
    /**
     * Error name
     */
    name: string;
    /**
     * Stack trace for the current error
     */
    stack: string;
    /**
     * Request status e.g. 1 = Error
     */
    status: number;
    /**
     * Array of warnings provided by the command
     */
    warnings: any[];
}
export declare class DiffResultParser {
    private response;
    constructor(stdout: string);
    isSuccessful(): boolean;
    getSuccessResponse(): DiffSuccessResponse | undefined;
    getErrorResponse(): DiffErrorResponse | undefined;
}
