import { Class } from '../types/ctor';
import { TypeGuard } from '../types/is';
declare namespace Check {
    /**
     * Access to the static is method of a class via any instance object.
     * Check if an object is an instanceof a class or type.
     */
    function is<TType, TClass extends Class<TType>>(value: TType, cls: TClass): value is InstanceType<TClass>;
    /**
     * Helper to check if something's a function.
     *
     * @returns true if the item is a function
     */
    const isFunction: TypeGuard<Function | ((...args: any[]) => any)>;
    /**
     * Helper to check if something's a boolean.
     *
     * @returns true if the item is a bool
     */
    const isBoolean: TypeGuard<boolean | Boolean>;
    /**
     * Helper to check if somethings a non-null object (as opposed to a primitive).
     *
     * @example
     *  {prop: 'value'}
     * @example
     *  new File()
     * @example
     *  {}
     *
     * @param value The value to check
     */
    const isObject: TypeGuard<NonNullable<object> | Record<any, any>>;
    /**
     * Check if an object is a plain object (not an instance of a class, or an array, or a function, etc)
     */
    const isPlainObject: TypeGuard<Record<any, unknown>>;
    /**
     * Check if an object has a property with the given key
     */
    function hasProp<TBase extends object | any[], TKey extends string | symbol | number>(obj: TBase, prop: TKey): obj is TBase & {
        [key in TKey]: any;
    };
    /**
     * Helper to check if somethings a non-null, non-array, index based object (as opposed to a primitive).
     *
     * @example
     *  {prop: 'value'}
     * @example
     *  new File()
     *
     * @param value The value to check
     */
    const isRecord: TypeGuard<{
        [key: string | number | symbol]: any;
    }>;
    /**
     * Check if an item specifically matches "{}"
     */
    const isEmptyObject: TypeGuard<{}>;
    /**
     * Helper to check if something is a number.
     */
    const isNumber: TypeGuard<number | Number>;
    /**
     * Helper to check if something is a string.
     */
    const isString: TypeGuard<string>;
    /**
     * Helper to check if something is a string.
     */
    const isSymbol: TypeGuard<symbol>;
    /**
     * Helper to check if somethings specifically an array.
     */
    const isArray: <T = any>(value: unknown, options?: {
        entryGuard?: ((item: any) => item is T) | undefined;
        allowEmpty?: boolean | undefined;
    }) => value is T[];
    /**
     * Check if something is an itterable.
     */
    const isNonStringIterable: (value: unknown, entryGuard?: ((item: any) => boolean) | undefined) => value is Iterable<any>;
    /**
     * Check if something is an itterable.
     */
    const isIterable: (value: unknown, entryGuard?: ((item: any) => boolean) | undefined) => value is Iterable<any>;
}
/** @alias {@link Check.is} */
export declare const is: typeof Check.is;
/** @alias {@link Check.isFunction} */
export declare const isFunction: TypeGuard<Function | ((...args: any[]) => any)>;
/** @alias {@link Check.isBoolean} */
export declare const isBoolean: TypeGuard<boolean | Boolean>;
/** @alias {@link Check.isObject} */
export declare const isObject: TypeGuard<object | Record<any, any>>;
/** @alias {@link Check.isRecord} */
export declare const isRecord: TypeGuard<{
    [key: string]: any;
    [key: number]: any;
    [key: symbol]: any;
}>;
/** @alias {@link Check.isEmptyObject} */
export declare const isEmptyObject: TypeGuard<{}>;
/** @alias {@link Check.isNumber} */
export declare const isNumber: TypeGuard<number | Number>;
/** @alias {@link Check.isString} */
export declare const isString: TypeGuard<string>;
/** @alias {@link Check.isSymbol} */
export declare const isSymbol: TypeGuard<symbol>;
/** @alias {@link Check.isArray} */
export declare const isArray: <T = any>(value: unknown, options?: {
    entryGuard?: ((item: any) => item is T) | undefined;
    allowEmpty?: boolean | undefined;
}) => value is T[];
/** @alias {@link Check.isIterable} */
export declare const isIterable: (value: unknown, entryGuard?: ((item: any) => boolean) | undefined) => value is Iterable<any>;
/** @alias {@link Check.isNonStringIterable} */
export declare const isNonStringIterable: (value: unknown, entryGuard?: ((item: any) => boolean) | undefined) => value is Iterable<any>;
/** @alias {@link Check.isPlainObject} */
export declare const isPlainObject: TypeGuard<Record<any, unknown>>;
/** @alias {@link Check.hasProp} */
export declare const hasProp: typeof Check.hasProp;
export { Check as If, Check as Check };
export default Check;
