/**
 * A method that can signal it's outer loop should be be broken
 */
export interface Breakable<TArgs extends any[], TResult = void, TBreakResultOverride = TResult> {
    (...args: TArgs): TResult | Break<TBreakResultOverride> | Break;
}
/**
 * Can be used to for(of) any iterable
 */
export declare function forEach<T>(items: Iterable<T>, doThis: (item: T) => void): void;
/**
 * Can be used to for(of) any iterable
 */
export declare function forIn<T, K>(items: Iterable<T>, doThis: (key: K) => void): void;
/**
 * Can be used to each any iterable
 */
export declare function each<T>(items: Iterable<T>, isTrue: (item: T) => boolean): boolean;
/**
 * Can be used to some any iterable
 */
export declare function some<T>(items: Iterable<T>, isTrue: (item: T) => boolean): boolean;
/**
 * Can be used to map any iterable
 */
export declare function map<T, R>(items: Iterable<T>, transform: (item: T) => R): Iterable<R>;
/**
 * Get the first item of an iterable.
 */
export declare function first<T>(items: Iterable<T>, where?: (item: T) => boolean): T | undefined;
/**
 * Returns the size of the given set
 */
export declare function count(items: Set<any>): number;
/**
 * Returns the size of the given map
 */
export declare function count(items: Map<any, any>): number;
/**
 * Returns the length of the given array
 */
export declare function count(items: Array<any>): number;
/**
 * Returns the number of values (size/length/count) of the given set of items.
 */
export declare function count(items: Iterable<any>): number;
/**
 * Returns the number of enumerable properties in the object
 */
export declare function count(items: object): number;
/**
 * Returns the number of chars in the string
 */
export declare function count(items: string): number;
/**
 * Returns the number
 */
export declare function count(items: number): number;
/**
 * Returns 1: for 1 unique symbol.
 */
export declare function count(items: symbol): 1;
/**
 * Used to help loop over breakables easily.
 *
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export declare function through<TResult = void, TRestOfArgs extends any[] = [], TBreakResultOverride = TResult>(toLoop: Breakable<[
    number,
    ...TRestOfArgs
], TResult, TBreakResultOverride>, over: number, options?: {
    args?: any[][];
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: [number, ...TRestOfArgs]) => void;
    onResult?: (result: TResult, loopHasBroken: boolean) => void;
}): void;
/**
 * Used to help loop over breakables easily.
 *
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export declare function through<TEntry, TResult = void, TBreakResultOverride = TResult>(toLoop: Breakable<[
    TEntry,
    ...any[]
], TResult, TBreakResultOverride>, over: Iterable<TEntry>, options?: {
    args?: any[];
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: [TEntry, ...any[]]) => void;
    onResult?: (result: TResult, loopHasBroken: boolean) => void;
}): void;
/**
 * Used to help loop over breakables easily.
 *
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export declare function through<TEntry, TResult = void, TArgs extends [TEntry, ...any] = [
    TEntry,
    ...any
], TBreakResultOverride = TResult>(toLoop: Breakable<TArgs, TResult, TBreakResultOverride>, over: Iterable<TEntry> | number, options?: {
    args?: Partial<TArgs>[];
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: TArgs) => void;
    onResult?: (result: TResult, loopHasBroken: boolean) => void;
}): void;
interface _Breakable<TArgs extends any[], TResult = void, TBreakResultOverride = TResult> extends Breakable<TArgs, TResult, TBreakResultOverride> {
}
declare function Loop(toLoop: Breakable<[number, ...any[]], any, any>, over: number, options?: {
    args?: any[][];
    onBreak?: (result: Break<any> | Break, ...args: [number, ...any[]]) => void;
    onResult?: (result: any, loopHasBroken: boolean) => void;
}): void;
declare namespace Loop {
    const forEach: typeof import("./loop").forEach;
    const forIn: typeof import("./loop").forIn;
    const count: typeof import("./loop").count;
    const through: typeof import("./loop").through;
    const some: typeof import("./loop").some;
    const each: typeof import("./loop").each;
    const map: typeof import("./loop").map;
    const first: typeof import("./loop").first;
    /**
     * Used to break from a breakable early.
     */
    class Break<TResult = void> {
        readonly return: TResult;
        readonly hasReturn: number;
        constructor(resultValue?: TResult);
    }
    interface Breakable<TArgs extends any[], TResult = void, TBreakResultOverride = TResult> extends _Breakable<TArgs, TResult, TBreakResultOverride> {
    }
}
declare const Break: typeof Loop.Break;
type Break<TResult = void> = Loop.Break<TResult>;
export { Break };
export { Loop as loop };
export default Loop;
