export declare const JAVA_HOME_KEY = "salesforcedx-vscode-apex.java.home";
export declare const JAVA_MEMORY_KEY = "salesforcedx-vscode-apex.java.memory";
export interface RequirementsData {
    java_home: string;
    java_memory: number | null;
}
/**
 * Resolves the requirements needed to run the extension.
 * Returns a promise that will resolve to a RequirementsData if all requirements are resolved.
 */
export declare function resolveRequirements(): Promise<RequirementsData>;
