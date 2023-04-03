import { Class } from "../types/ctor";
import Loop from "../helpers/loop";
import { TypeGuard } from "../types/is";

/**
 * Helper to check if something's a function.
 * 
 * @returns true if the item is a function
 */
export const isFunction: TypeGuard<Function | ((...args: any[]) => any)> = (value: unknown)
  : value is Function =>
  typeof value === "function";

/**
 * Helper to check if something's a boolean.
 * 
 * @returns true if the item is a bool
 */
export const isBoolean: TypeGuard<boolean | Boolean> = (value: unknown)
  : value is boolean | Boolean =>
  typeof value === "boolean";

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
export const isObject: TypeGuard<{} | object | Record<any, any>> = (value: unknown)
  : value is Record<string | number | symbol, unknown> & object =>
  typeof value === "object" && value !== null;

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
  return !proto || (proto === Object.prototype);
}

/**
 * Helper to check if something is a number.
 */
export const isNumber: TypeGuard<number | Number> = (value: unknown)
  : value is number =>
  typeof value === "number";

/**
 * Helper to check if something is a string.
 */
export const isString: TypeGuard<String | string> = (value: unknown)
  : value is string =>
  typeof value === "string";

/**
 * Helper to check if something is a string.
 */
export const isSymbol: TypeGuard<symbol> = (value: unknown)
  : value is symbol =>
  typeof value === "symbol";

/**
 * Helper to check if somethings specifically an array.
 */
export const isArray = <T = any>(
  value: unknown,
  options: {
    entryGuard?: (item: any) => item is T,
    allowEmpty?: boolean
  } = {
      allowEmpty: true
    })
  : value is Array<T> =>
  Array.isArray(value)
  && (value.length
    ? options?.entryGuard?.(value) ?? true
    : options?.allowEmpty ?? true)

/**
 * Check if something is an itterable.
 */
export const isNonStringIterable = (
  value: unknown,
  entryGuard?: (item: any) => boolean,
): value is Exclude<Iterable<any>, string> =>
  !entryGuard
    ? Symbol.iterator in Object(value) && !isString(value)
    : Symbol.iterator in Object(value) && !isString(value) && Loop.each(value as Iterable<any>, entryGuard);

/**
 * Check if something is an itterable.
 */
export const isIterable = (
  value: unknown,
  entryGuard?: (item: any) => boolean,
): value is Iterable<any> =>
  !entryGuard
    ? Symbol.iterator in Object(value)
    : Symbol.iterator in Object(value) && Loop.each(value as Iterable<any>, entryGuard);

const _isObject
  = isObject;
const _isEmptyObject
  = isEmptyObject;
const _isArray = isArray;
const _isFunction
  = isFunction;
const _isBoolean
  = isBoolean;
const _isNumber
  = isNumber;
const _isString
  = isString;
const _isSymbol
  = isSymbol;
const _isIterable
  = isIterable;
const _isNonStringIterable
  = isNonStringIterable;

namespace If {

  /**
   * Access to the static is method of a class via any instance object.
   * Check if an object is an instanceof a class or type.
   * 
   * @alias {@link TClass.is(any)} ?? this instanceof cls
   */
  export function is<
    TType,
    TClass extends Class<TType>,
  >(
    value: TType,
    cls: TClass
  ) {
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
        return cls.is(value as any);
      } // if the class doesn't defined it's own is method, then we can just check if it's an instance of the class
      else {
        return value instanceof cls;
      }
    }
    else {
      // if the constructor is a unique class, then we can call the default is method from that class
      return cls.constructor.is(value as any);
    }
  }

  /** @alias {@link IIs.isObject(this)} */
  export const isObject
    = _isObject;
  /** @alias {@link IIs.isEmptyObject(this)} */
  export const isEmptyObject
    = _isEmptyObject;
  /** @alias {@link IIs.isArray(this)} */
  export const isArray
    = _isArray;
  /** @alias {@link IIs.isFunction(this)} */
  export const isFunction
    = _isFunction;
  /** @alias {@link IIs.isBoolean(this)} */
  export const isBoolean
    = _isBoolean;
  /** @alias {@link IIs.isNumber(this)} */
  export const isNumber
    = _isNumber;
  /** @alias {@link IIs.isString(this)} */
  export const isString
    = _isString;
  /** @alias {@link IIs.isSymbol(this)} */
  export const isSymbol
    = _isSymbol;
  /** @alias {@link IIs.isIterable(this)} */
  export const isIterable
    = _isIterable;
  /** @alias {@link IIs.isNonStringIterable(this)} */
  export const isNonStringIterable
    = _isNonStringIterable;
}

export default If;