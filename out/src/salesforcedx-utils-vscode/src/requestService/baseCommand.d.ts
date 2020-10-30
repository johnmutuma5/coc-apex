export declare abstract class BaseCommand {
    protected readonly queryString: string | undefined;
    constructor(queryString?: string);
    abstract getCommandUrl(): string;
    getQueryString(): string | undefined;
    abstract getRequest(): string | undefined;
}
