import { ConfigValue } from '@salesforce/core';
export declare class ConfigUtil {
    static getUsername(projectPath: string): Promise<string | undefined>;
    static getConfigValue(projectPath: string, key: string): Promise<ConfigValue | undefined>;
}
