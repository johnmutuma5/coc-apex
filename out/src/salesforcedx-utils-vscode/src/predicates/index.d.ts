export interface Predicate<T> {
    apply(item: T): PredicateResponse;
}
export declare class PredicateResponse {
    result: boolean;
    message: string;
    private constructor();
    static of(result: boolean, message: string): PredicateResponse;
    static true(): PredicateResponse;
    static false(): PredicateResponse;
}
