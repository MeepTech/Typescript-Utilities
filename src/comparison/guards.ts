import { Class } from '../types/ctor';
import Loop from '../helpers/loop';
import { TypeGuard } from '../types/is';

namespace Check {
  /**
   * Access to the static is method of a class via any instance object.
   * Check if an object is an instanceof a class or type.
   */
  export function is<
    TType,
    TClass extends Class<TType>
  >(
    value: TType,
    cls: TClass
  ): value is InstanceType<TClass> {
    if (value instanceof cls) {
      return true;
    }

    if (cls === (String as any)) {
      return isString(value);
    } else if (cls === (Number as any)) {
      return isNumber(value);
    } else if (cls === (Boolean as any)) {
      return isBoolean(value);
    } else if (cls === (Symbol as any)) {
      return isSymbol(value);
    } else if (cls === (Array as any)) {
      return isArray(value);
    } else if (cls === (Function as any)) {
      return isFunction(value);
    } else if (cls === (Object as any)) {
      return isObject(value);
    }

    // if it's class instead of an instance, then we need to check the static is method on the class itself
    else if (cls.constructor === Function) {
      if (cls.hasOwnProperty('is')) {
        return (cls as any).is(value as any);
      } // if the class doesn't defined it's own is method, then we can just check if it's an instance of the class
      else {
        return value instanceof cls;
      }
    } // if we were handed an instance accidentally, and it's a constructor function, check if it has an is
    else if (
      cls.constructor.hasOwnProperty('is')
    ) {
      // if the constructor is a unique class, then we can call the default is method from that class
      return (cls.constructor as any).is(
        value as any
      );
    } else {
      return value instanceof cls.constructor;
    }
  }

  /**
   * Helper to check if something's a function.
   *
   * @returns true if the item is a function
   */
  export const isFunction: TypeGuard<
    Function | ((...args: any[]) => any)
  > = (value: unknown): value is Function =>
      typeof value === 'function';

  /**
   * Helper to check if something's a boolean.
   *
   * @returns true if the item is a bool
   */
  export const isBoolean: TypeGuard<
    boolean | Boolean
  > = (
    value: unknown
  ): value is boolean | Boolean =>
      typeof value === 'boolean';

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
  export const isObject: TypeGuard<
    NonNullable<object> | Record<any, any>
  > = (
    value: unknown
  ): value is Record<
    string | number | symbol,
    unknown
  > &
  object =>
      typeof value === 'object' && value !== null;

  /**
   * Check if an object is a plain object (not an instance of a class, or an array, or a function, etc)
   */
  export const isPlainObject: TypeGuard<
    Record<any, any> & { constructor: Object }
  > = (
    value: unknown
  ): value is Record<any, any> & {
    constructor: Object
  } => {
      if (!isObject(value)) {
        return false;
      }

      return value?.constructor === Object;
    };


  /**
   * Check if an object has a property with the given key
   */
  export function hasProp<
    TBase extends object | any[],
    TKey extends string | symbol | number
  >(
    obj: TBase,
    prop: TKey
  ): obj is TBase & {
    [key in TKey]: any;
  } {
    return obj?.hasOwnProperty(prop);
  }

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
  export const isRecord: TypeGuard<{
    [key: string | number | symbol]: any;
  }> = (
    value: unknown
  ): value is Record<any, any> =>
      typeof value === 'object' && value !== null;

  /**
   * Check if an item specifically matches "{}"
   */
  export const isEmptyObject: TypeGuard<{}> = (
    value: unknown
  ): value is {} => {
    for (var prop in value as any) {
      return false;
    }

    const proto = Object.getPrototypeOf(value);
    return !proto || proto === Object.prototype;
  };

  /**
   * Helper to check if something is a number.
   */
  export const isNumber: TypeGuard<
    number | Number
  > = (value: unknown): value is number =>
      typeof value === 'number';

  /**
   * Helper to check if something is a string.
   */
  export const isString: TypeGuard<string> = (
    value: unknown
  ): value is string => typeof value === 'string';

  /**
   * Helper to check if something is a string.
   */
  export const isSymbol: TypeGuard<symbol> = (
    value: unknown
  ): value is symbol => typeof value === 'symbol';

  /**
   * Helper to check if somethings specifically an array.
   */
  export const isArray = <T = any>(
    value: unknown,
    options: {
      entryGuard?: (item: any) => item is T;
      allowEmpty?: boolean;
    } = {
        allowEmpty: true,
      }
  ): value is Array<T> =>
    Array.isArray(value) &&
    (value.length
      ? options?.entryGuard?.(value) ?? true
      : options?.allowEmpty ?? true);

  /**
   * Check if something is an itterable.
   */
  export const isNonStringIterable = (
    value: unknown,
    entryGuard?: (item: any) => boolean
  ): value is Exclude<Iterable<any>, string> =>
    !entryGuard
      ? Symbol.iterator in Object(value) &&
      !isString(value)
      : Symbol.iterator in Object(value) &&
      !isString(value) &&
      Loop.each(
        value as Iterable<any>,
        entryGuard
      );

  /**
   * Check if something is an itterable.
   */
  export const isIterable = (
    value: unknown,
    entryGuard?: (item: any) => boolean
  ): value is Iterable<any> =>
    !entryGuard
      ? Symbol.iterator in Object(value)
      : Symbol.iterator in Object(value) &&
      Loop.each(
        value as Iterable<any>,
        entryGuard
      );
}

/** @alias {@link Check.is} */
export const is = Check.is;
/** @alias {@link Check.isFunction} */
export const isFunction = Check.isFunction;
/** @alias {@link Check.isBoolean} */
export const isBoolean = Check.isBoolean;
/** @alias {@link Check.isObject} */
export const isObject = Check.isObject;
/** @alias {@link Check.isRecord} */
export const isRecord = Check.isRecord;
/** @alias {@link Check.isEmptyObject} */
export const isEmptyObject = Check.isEmptyObject;
/** @alias {@link Check.isNumber} */
export const isNumber = Check.isNumber;
/** @alias {@link Check.isString} */
export const isString = Check.isString;
/** @alias {@link Check.isSymbol} */
export const isSymbol = Check.isSymbol;
/** @alias {@link Check.isArray} */
export const isArray = Check.isArray;
/** @alias {@link Check.isIterable} */
export const isIterable = Check.isIterable;
/** @alias {@link Check.isNonStringIterable} */
export const isNonStringIterable =
  Check.isNonStringIterable;
/** @alias {@link Check.isPlainObject} */
export const isPlainObject = Check.isPlainObject;
/** @alias {@link Check.hasProp} */
export const hasProp = Check.hasProp;

export { Check as If, Check as Check };

export default Check;
