import { ExtensionContext } from 'coc.nvim';
import { SObjectRefreshSource, SObjectCategory } from './salesforcedx-sobjects-faux-generator';
import { ParametersGatherer, ContinueResponse, CancelResponse } from './salesforcedx-utils-vscode';
export declare type RefreshSelection = {
    category: SObjectCategory;
    source: SObjectRefreshSource;
};
export declare class SObjectRefreshGatherer implements ParametersGatherer<RefreshSelection> {
    private source?;
    constructor(source?: SObjectRefreshSource);
    gather(): Promise<ContinueResponse<RefreshSelection> | CancelResponse>;
}
export declare function forceGenerateFauxClassesCreate(source?: SObjectRefreshSource): Promise<void | import("./salesforcedx-sobjects-faux-generator").SObjectRefreshResult>;
export declare function activate(context: ExtensionContext): Promise<void>;
