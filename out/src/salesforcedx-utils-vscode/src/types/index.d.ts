export interface PreconditionChecker {
    check(): Promise<boolean> | boolean;
}
export interface PostconditionChecker<T> {
    check(inputs: ContinueResponse<T> | CancelResponse): Promise<ContinueResponse<T> | CancelResponse>;
}
export interface ContinueResponse<T> {
    type: 'CONTINUE';
    data: T;
}
export interface CancelResponse {
    type: 'CANCEL';
    msg?: string;
}
export interface ParametersGatherer<T> {
    gather(): Promise<CancelResponse | ContinueResponse<T>>;
}
export declare type DirFileNameSelection = {
    /**
     * Name of the component (FullName in the API)
     */
    fileName: string;
    /**
     * Relative workspace path to save the component
     */
    outputdir: string;
};
/**
 * Representation of a metadata component to be written to the local workspace
 */
export declare type LocalComponent = DirFileNameSelection & {
    /**
     * The component's metadata type
     */
    type: string;
    /**
     * Optional suffix to overwrite in case metadata dictionary does not have it
     */
    suffix?: string;
};
export declare type FunctionInfo = DirFileNameSelection & {
    language: string;
};
