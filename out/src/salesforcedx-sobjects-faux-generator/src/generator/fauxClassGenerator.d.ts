/// <reference types="node" />
import { EventEmitter } from 'events';
import { SObject, SObjectCategory } from '../describe';
export declare const INDENT = "    ";
export interface CancellationToken {
    isCancellationRequested: boolean;
}
export declare enum SObjectRefreshSource {
    Manual = "manual",
    Startup = "startup"
}
export interface FieldDeclaration {
    modifier: string;
    type: string;
    name: string;
    comment?: string;
}
export interface SObjectRefreshResult {
    data: {
        category?: SObjectCategory;
        source?: SObjectRefreshSource;
        cancelled: boolean;
        standardObjects?: number;
        customObjects?: number;
    };
    error?: {
        message: string;
        stack?: string;
    };
}
export declare class FauxClassGenerator {
    private static typeMapping;
    private static fieldDeclToString;
    static commentToString(comment?: string): string;
    private emitter;
    private cancellationToken;
    private result;
    constructor(emitter: EventEmitter, cancellationToken?: CancellationToken);
    generate(projectPath: string, type: SObjectCategory, source: SObjectRefreshSource): Promise<SObjectRefreshResult>;
    isRequiredSObject(sobject: string): boolean;
    generateFauxClassText(sobject: SObject): string;
    generateFauxClass(folderPath: string, sobject: SObject): string;
    cleanupSObjectFolders(baseSObjectsFolder: string, type: SObjectCategory): void;
    private errorExit;
    private successExit;
    private cancelExit;
    private stripId;
    private capitalize;
    private getTargetType;
    private getReferenceName;
    private generateChildRelationship;
    private generateField;
    private generateFauxClasses;
    private generateFauxClassDecls;
    private generateFauxClassTextFromDecls;
    private createIfNeededOutputFolder;
    private logSObjects;
    private logFetchedObjects;
}
