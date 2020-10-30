export declare class Command {
    readonly command: string;
    readonly description?: string;
    readonly args: string[];
    readonly logName?: string;
    constructor(builder: CommandBuilder);
    toString(): string;
    toCommand(): string;
}
export declare class CommandBuilder {
    readonly command: string;
    description?: string;
    args: string[];
    logName?: string;
    constructor(command: string);
    withDescription(description: string): CommandBuilder;
    withArg(arg: string): CommandBuilder;
    withFlag(name: string, value: string): CommandBuilder;
    withJson(): CommandBuilder;
    withLogName(logName: string): CommandBuilder;
    build(): Command;
}
export declare class SfdxCommandBuilder extends CommandBuilder {
    constructor();
}
