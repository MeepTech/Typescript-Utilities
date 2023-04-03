/**
 * A method that can signal it's outer loop should be be broken
 */
export interface IBreakable<TArgs extends any[], TResult = void, TBreakResultOverride = TResult> {
  (...args: TArgs): TResult | Break<TBreakResultOverride> | Break;
}

/**
 * Used to break from a breakable early.
 */
export class Break<TResult = void> {
  readonly return: TResult;
  readonly hasReturn: number;

  constructor(resultValue?: TResult) {
    this.return = resultValue!;
    this.hasReturn = arguments.length;
  }
}

/**
 * Can be used to for(of) any iterable
 */
export function forEach<T>(items: Iterable<T>, doThis: (item?: T) => void) {
  for (const item of items) {
    doThis(item);
  }
}

/**
 * Can be used to for(of) any iterable
 */
export function forIn<T, K>(items: Iterable<T>, doThis: (key?: K) => void) {
  for (const item in items) {
    doThis(item as K);
  }
}

/**
 * Can be used to each any iterable
 */
export function each<T>(items: Iterable<T>, isTrue: (item?: T) => boolean): boolean {
  for (const item of items) {
    if (!isTrue(item)) {
      return false;
    }
  }

  return true;
}

/**
 * Can be used to some any iterable
 */
export function some<T>(items: Iterable<T>, isTrue: (item?: T) => boolean): boolean {
  for (const item of items) {
    if (!isTrue(item)) {
      return true;
    }
  }

  return false;
}

/**
 * Can be used to map any iterable
 */
export function map<T, R>(items: Iterable<T>, transform: (item?: T) => R): Iterable<R> {
  const result: R[] = [];
  for (const item of items) {
    result.push(transform(item));
  }

  return result;
}

/**
 * Get the first item of an iterable.
 */
export function first<T>(items: Iterable<T>, where?: (item: T) => boolean): T | undefined {
  for (const item of items) {
    if (where?.(item) ?? true) {
      return item;
    }
  }

  return undefined;
}

/**
 * Returns the size of the given set
 */
export function count(items: Set<any>): number;

/**
 * Returns the size of the given map
 */
export function count(items: Map<any, any>): number;

/**
 * Returns the length of the given array
 */
export function count(items: Array<any>): number;

/**
 * Returns the number of values (size/length/count) of the given set of items.
 */
export function count(items: Iterable<any>): number;

/**
 * Returns the number of enumerable properties in the object
 */
export function count(items: object): number;

/**
 * Returns the number of chars in the string
 */
export function count(items: string): number;

/**
 * Returns the number
 */
export function count(items: number): number;

/**
 * Returns 1: for 1 unique symbol.
 */
export function count(items: symbol): 1;

export function count(items: Iterable<any> | object | string | number | symbol): number {
  if (items.is(Array)) {
    return items.length;
  } else if (items instanceof Set || items instanceof Map) {
    return items.size;
  } else if (items.isNonStringIterable()) {
    const potentialCount = (items as any).length
      ?? (items as any).size
      ?? (items as any).count
      ?? (items as any).number;

    if (potentialCount === undefined) {
      return [...items].length;
    } else {
      if (potentialCount.is(Number)) {
        return potentialCount;
      } else if (potentialCount.is(Function)) {
        return potentialCount();
      } else {
        throw new Error("Could not determine count of items");
      }
    }
  } else if (items.isObject()) {
    return Object.keys(items).length;
  } else if (items.is(String)) {
    return (items as string).length;
  } else if (items.is(Number)) {
    return items as number;
  } else if (items.isSymbol()) {
    return 1;
  } else {
    throw new Error("Could not determine count of items");
  }
}

/**
 * Used to help loop over breakables easily.
 * 
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export function through<TResult = void, TRestOfArgs extends any[] = [], TBreakResultOverride = TResult>(
  toLoop: IBreakable<[number, ...TRestOfArgs], TResult, TBreakResultOverride>,
  over: number,
  options?: {
    args?: any[][],
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: [number, ...TRestOfArgs]) => void,
    onResult?: (result: TResult, loopHasBroken: boolean) => void
  }
): void;

/**
 * Used to help loop over breakables easily.
 * 
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export function through<TEntry, TResult = void, TBreakResultOverride = TResult>(
  toLoop: IBreakable<[TEntry, ...any[]], TResult, TBreakResultOverride>,
  over: Iterable<TEntry>,
  options?: {
    args?: any[],
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: [TEntry, ...any[]]) => void;
    onResult?: (result: TResult, loopHasBroken: boolean) => void
  }
): void;

/**
 * Used to help loop over breakables easily.
 * 
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export function through<TEntry, TResult = void, TArgs extends [TEntry, ...any] = [TEntry, ...any], TBreakResultOverride = TResult>(
  toLoop: IBreakable<TArgs, TResult, TBreakResultOverride>,
  over: Iterable<TEntry> | number,
  options?: {
    args?: Partial<TArgs>[],
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: TArgs) => void
    onResult?: (result: TResult, loopHasBroken: boolean) => void
  }
): void

/**
 * Used to help loop over breakables easily.
 * 
 * @param toLoop The breakable to loop
 * @param over The number of loops or entries to itterate over per loop
 * @param options Options.
 */
export function through<TEntry, TResult = void, TArgs extends any[] = [TEntry, number, ...any], TBreakResultOverride = TResult>(
  toLoop: IBreakable<TArgs, TResult, TBreakResultOverride>,
  over: Iterable<TEntry> | number,
  options?: {
    args?: Partial<TArgs>[],
    onBreak?: (result: Break<TBreakResultOverride> | Break, ...args: TArgs) => void
    onResult?: (result: TResult, loopHasBroken: boolean) => void
  }
): void {
  if (!options) {
    if (over.isIterable()) {
      let index = 0;
      for (const each of over) {
        toLoop(...[each, index++] as TArgs);
      }
    } // over an index.
    else {
      for (let index = 0; index < over; index++) {
        /** @ts-expect-error: spread issue*/
        toLoop(index);
      }
    }
  } else {
    // setup params
    const overIsArray = over.is(Array);
    let overIndex = 0;
    let indexIndex = overIsArray ? 1 : 0;
    const args: ((index: number) => any)[] = [];

    // entry
    if (overIsArray) {
      const iter = over[Symbol.iterator]();
      args[overIndex] = () => iter.next().value as TEntry;
    }

    // index
    args[indexIndex] = (i) => i;

    // args
    let indexOffset = indexIndex;
    if (options.args) {
      for (const e of options.args.entries()) {
        args[++indexOffset] = () => e;
      }
    }

    // loop
    const count: number = overIsArray ? over.length : over.isIterable() ? Loop.count(over as Iterable<any>) : over as number;
    for (let index = 0; index < count; index++) {
      const params = args.map(get => get(index));
      const result = toLoop(...params as TArgs);
      if (result instanceof Break) {
        if (result.hasReturn) {
          options.onResult?.(result.return as TResult, true);
        } else {
          options.onBreak?.(result, ...params as TArgs);
        }
      } else {
        options.onResult?.(result as TResult, false);
      }
    }
  }
}

const _forEach = forEach;
const _forIn = forIn;
const _each = each;
const _some = some;
const _count = count;
const _through = through;
const _map = map;
const _first = first;

type _Break = Break;
interface _IBreakable<TArgs extends any[], TResult = void, TBreakResultOverride = TResult>
  extends IBreakable<TArgs, TResult, TBreakResultOverride> { }

namespace Loop {
  export const forEach = _forEach;
  export const forIn = _forIn;
  export const count = _count;
  export const through = _through;
  export const some = _some;
  export const each = _each;
  export const map = _map;
  export const first = _first;
  export type Break = _Break;
  export interface IBreakable<TArgs extends any[], TResult = void, TBreakResultOverride = TResult>
    extends _IBreakable<TArgs, TResult, TBreakResultOverride> { }
}

export default Loop;