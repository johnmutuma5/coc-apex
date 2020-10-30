/**
 * @deprecated
 * NOTE: This code is deprecated in favor of using ConfigUtil.ts
 */
export declare class ForceConfigGet {
    getConfig(projectPath: string, ...keys: string[]): Promise<Map<string, string>>;
}
