//#region Global
declare global {
  interface Object extends IIs { }
}

import If from "./guards";
import { Class } from "../types/ctor";
import { implementsStatic } from "../decorators/static";
import { TypeGuard } from "../types/is";

/**
 * Require a class to implement 'is' in a static manner.
 * 
 * @decorator class
 */
export const hasStaticIs = implementsStatic<{
  is: (value: any) => ReturnType<typeof If.is>
}>()

/**
 * Global interface for all objects to check if they are an instance of a class, object, or primative type.
 */
export interface IIs {

  /** @alias {@link If.is} */
  is<
    TClass extends Class<TType>,
    TType = InstanceType<TClass>
  >(
    cls: TClass
  ): this is InstanceType<TClass>

  /** @alias {@link If.isObject} */
  isObject(): this is ({} & Record<string | number | symbol, unknown>);

  /** @alias {@link If.isSymbol} */
  isSymbol(): this is symbol;

  /** @alias {@link If.isIterable} */
  isIterable(): this is Iterable<unknown>;
  isIterable<
    TType,
    TClass extends Class<TType> = Class<TType>
  >(entryGuard: TypeGuard<TClass>): this is Iterable<TType>;

  /** @alias {@link If.isNonStringIterable} */
  isNonStringIterable(): this is Iterable<unknown>;
  isNonStringIterable<
    TType,
    TClass extends Class<TType> = Class<TType>
  >(entryGuard: TypeGuard<TClass>): this is Iterable<TType>;
}

Object.defineProperty(Object.prototype, 'is', {
  value: function (this: any, cls: any) {
    return If.is(this, cls)
  },
  enumerable: false
} as {
  value: typeof If.is
});

Object.defineProperty(Object.prototype, 'isObject', {
  value: function (this: any) {
    return If.isObject(this);
  } as any,
  enumerable: false,
  writable: false
} as {
  value: typeof If.isObject
});

Object.defineProperty(Object.prototype, 'isSymbol', {
  value: function (this: any) {
    return If.isSymbol(this);
  } as any,
  enumerable: false,
  writable: false
} as {
  value: typeof If.isSymbol
});

Object.defineProperty(Object.prototype, 'isIterable', {
  value: function (this: any, guardFunction?: any) {
    return If.isIterable(this, guardFunction);
  },
  enumerable: false,
  writable: false
});

Object.defineProperty(Object.prototype, 'isNonStringIterable', {
  value: function (this: any, guardFunction?: any) {
    return If.isNonStringIterable(this, guardFunction);
  },
  enumerable: false,
  writable: false
});