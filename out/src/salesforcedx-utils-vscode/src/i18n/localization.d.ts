export declare const BASE_FILE_NAME = "i18n";
export declare const BASE_FILE_EXTENSION = "js";
export declare const DEFAULT_LOCALE = "en";
export declare const MISSING_LABEL_MSG = "!!! MISSING LABEL !!!";
export interface Config {
    locale: string;
}
export interface LocalizationProvider {
    localize(label: string, ...args: any[]): string;
}
export declare class Localization implements LocalizationProvider {
    private readonly delegate;
    constructor(delegate: Message);
    localize(label: string, ...args: any[]): string;
}
export declare type MessageBundle = {
    readonly [index: string]: string;
};
export declare class Message implements LocalizationProvider {
    private readonly delegate?;
    private readonly messages;
    constructor(messages: MessageBundle, delegate?: Message);
    localize(label: string, ...args: any[]): string;
    private getLabel;
}
