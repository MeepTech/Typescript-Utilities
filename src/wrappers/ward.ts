import { RequireAtLeastOne } from "../types/or";
import { Class } from '../types/ctor';
import { implementsStatic } from "../decorators/static";
import { Protect } from "../types/mod";
import Loop from '../helpers/loop';

require("../comparison/is");

//#region consts and enums

/**
 * The symbol used to index ward related-traits of a class or instance
 * // TODO: add to global keys section
 */
export const $WARD: unique symbol
  = Symbol("$WARD");

/**
 * Ways to access a property from a warded object usin 'try'
 */
enum WardPropertyAccess {

  /**
   * The property can't be found or accessed
   */
  None = 0 as const,

  /**
   * The property can be fetched
   */
  Get = 1 as const,

  /**
   * The property can be set
   */
  Set = 2 as const,
}

/**
 * Ward property access levels.
 */
export {
  WardPropertyAccess as WardPropAccess
};

//#endregion

//#region constructor

/**
 * Used to indicate a class has a default warding configuration.
 * 
 * @decorator class
 * @alias {@link implementsStatic<IHaveWardConfig<T>>}
 */
export const implementsWardConfig = <
  TClass extends Class<T>,
  T extends object & IHaveWardConfig<T> = InstanceType<TClass>
>(
  cls: TClass,
  _: any
  // make the extended constructor a requirement of the class itself:
) => { cls };

/**
 * Interface for the implementation of the ward ctor/class
 */
interface WardConstructor {

  /** @alias {@link $WARD} */
  readonly SYMBOL: typeof $WARD;

  /** @alias {@link hasWardConfig} */
  readonly hasConfig: typeof hasWardConfig;

  /** @alias {@link implementsWardConfig} */
  readonly implementsConfig: typeof implementsWardConfig;

  /** @alias {@link WardPropertyAccess} */
  readonly Can: typeof WardPropertyAccess;

  /** @alias {@link ward} */
  readonly from: typeof ward;

  /** @alias {@link isWard} */
  readonly is: typeof isWard;

  /** @alias {@link isWarded} */
  readonly has: typeof isWarded;

  /** @alias {@link isNotWarded} */
  readonly isNot: typeof isNotWarded;

  /**
   * A function that can be used to construct a new ward for a target.
   */
  new <
    T extends object,
    TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
  >(
    target: T,
    hiddenKeys?: ReadonlyArray<TPropKeysToOmit> | undefined,
    protectedKeys?: ReadonlyArray<TPropKeysToProtect>
  ): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

  /**
   * A function that can be used to construct a new ward for a target.
   */
  new <
    T extends object,
    TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
  >(
    target: T,
    options: RequireAtLeastOne<{
      readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
      readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
    }>
  ): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

  /**
   * A function that can be used to create a new ward from a target.
   */
  <
    T extends object,
    TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
  >(
    target: T,
    hiddenKeys?: ReadonlyArray<TPropKeysToOmit> | undefined,
    protectedKeys?: ReadonlyArray<TPropKeysToProtect>
  ): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

  /**
   * A function that can be used to create a new ward from a target.
   */
  <
    T extends object,
    TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
  >(
    target: T,
    options: RequireAtLeastOne<{
      readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
      readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
    }>
  ): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;
}

/**
 * A function that can be used to create a new ward for a target.
 */
function WardConstructor<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
>(
  this: Ward<T, TPropKeysToOmit, TPropKeysToProtect>,
  target: T,
  ...wards: readonly [
    hiddenKeys?: ReadonlyArray<TPropKeysToOmit>,
    protectedKeys?: ReadonlyArray<TPropKeysToProtect>
  ] | readonly [RequireAtLeastOne<{
    readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
    readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
  }>?]
): Ward<T, TPropKeysToOmit, TPropKeysToProtect> {
  if (!wards[0]?.is(Array) || !wards[1]?.is(Array)) {
    return ward<T, TPropKeysToOmit, TPropKeysToProtect>(
      target,
      wards[0] as ReadonlyArray<TPropKeysToOmit> | undefined,
      wards[1]
    )
  } else if (wards[0]?.isObject()) {
    return ward<T, TPropKeysToOmit, TPropKeysToProtect>(
      target,
      wards[0] as RequireAtLeastOne<{
        readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
        readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
      }>
    )
  } else {
    return ward<T, TPropKeysToOmit, TPropKeysToProtect>(target);
  }
}

const Ward: WardConstructor
  = WardConstructor as unknown as WardConstructor;

/** @ts-expect-error: readonly-first time set */
Ward.SYMBOL
  = $WARD;

/** @ts-expect-error: readonly-first time set */
Ward.hasConfig
  = hasWardConfig;

/** @ts-expect-error: readonly-first time set */
Ward.implementsConfig
  = implementsWardConfig;

/** @ts-expect-error: readonly-first time set */
Ward.Can
  = WardPropertyAccess;

/** @ts-expect-error: readonly-first time set */
Ward.from
  = ward;

/** @ts-expect-error: readonly-first time set */
Ward.is
  ??= isWard;

/** @ts-expect-error: readonly-first time set */
Ward.has
  = isWarded;

/** @ts-expect-error: readonly-first time set */
Ward.isNot
  = isNotWarded;

//#endregion

//#region instance

function isWard<
  T extends object
>(
  value: unknown,
): value is Ward<T> {
  return value?.hasOwnProperty($WARD) ?? false;
}

/**
 * Used to check if a value, and/or a value's specific properties are warded.
 */
function isWarded<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
>(
  value: unknown,
  withHiddenKeys?: ReadonlyArray<TPropKeysToOmit>,
  withProtectedKeys?: ReadonlyArray<TPropKeysToProtect>
): value is Ward<T, TPropKeysToOmit, TPropKeysToProtect> {
  return isWard<T>(value)
    && (withHiddenKeys?.every(k => value[$WARD].config.DEFAULT_HIDDEN_KEYS?.includes(k) ?? false) ?? true)
    && (withProtectedKeys?.every(k => value[$WARD].config.DEFAULT_PROTECTED_KEYS?.includes(k) ?? false) ?? true);
}

/**
 * Used to check if a value, or a value's specific properties are not warded.
 * defaults to making sure NOTHING is warded, if you want to check a specific property or subset of properties, you must pass them all in.
 */
function isNotWarded<
  T extends object,
  TUnhiddenPropKeys extends keyof T | undefined = undefined,
  TUnprotectedPropKeys extends keyof T | undefined = undefined
>(
  value: unknown,
  withUnHiddenKeys?: ReadonlyArray<TUnhiddenPropKeys>,
  withUnProtectedKeys?: ReadonlyArray<TUnprotectedPropKeys>
): value is ((TUnhiddenPropKeys extends keyof T
  ? (TUnprotectedPropKeys extends keyof T
    ? Pick<T, TUnhiddenPropKeys | TUnprotectedPropKeys>
    : Pick<T, TUnhiddenPropKeys>)
  : T)
) {
  return !isWard<T>(value)
    || (
      (value[$WARD].config.DEFAULT_HIDDEN_KEYS?.length
        ? !(withUnHiddenKeys
          ?.some(k =>
            value[$WARD].config.DEFAULT_HIDDEN_KEYS!
              .includes(k) ?? false)
          ?? true)
        : true)
      && (value[$WARD].config.DEFAULT_HIDDEN_KEYS?.length
        ? !(withUnProtectedKeys
          ?.some(k =>
            value[$WARD].config.DEFAULT_PROTECTED_KEYS!
              .includes(k) ?? false)
          ?? true)
        : true)
    );
}

type WardTryer<T extends object> = (
  // TOOD: a use for just .try() with no options?
  //(() => { [key in _keyofTExceptConstructor<T>]: boolean })
  (

    /**
     * Attempt to get or set the given potentially warded properties.
     *
     * @param to - An object containing the properties to attempt to get or set.
     *
    * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
     */
    <TCanGet extends _keyofTExceptConstructor<T> = never, TCanSet extends _keyofTExceptConstructor<T> = never>(to: RequireAtLeastOne<{
      get: Iterable<TCanGet>;
      set: Iterable<TCanSet>;
    }>) => ({
      [cgKey in TCanGet]: TryResult<T, 'canGet', cgKey>;
    } & {
        [csKey in TCanSet]: TryResult<T, 'canSet', csKey>;
      }))
  & (

    /**
     * Attempt to get or set the given potentially warded properties.
     *
     * @param to - An object containing the properties to attempt to get or set.
     *
    * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
     */
    <TCanGet extends _keyofTExceptConstructor<T> = never, TCanSet extends _keyofTExceptConstructor<T> = never, TTrySet extends _keyofTExceptConstructor<T> = never>(to: RequireAtLeastOne<{
      get: Iterable<TCanGet>;
      set: ({
        [key in TTrySet]?: T[key];
      } | Iterable<TCanSet | {
        [key in TTrySet]?: T[key];
      }>);
    }>) => ({
      [cgKey in TCanGet]: TryResult<T, 'canGet', cgKey>;
    } & {
        [csKey in TCanSet]: TryResult<T, 'canSet', csKey>;
      } & {
        [tsKey in TTrySet]: TryResult<T, 'trySet', tsKey>;
      }))
  & (

    /**
     * Attempt to get or set the given potentially warded properties.
     *
     * @param to - An object containing the properties to attempt to get or set.
     *
    * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
     */
    <TCanGet extends _keyofTExceptConstructor<T> = never, TTrySet extends _keyofTExceptConstructor<T> = never>(to: RequireAtLeastOne<{
      get: Iterable<TCanGet>;
      set: ({
        [key in TTrySet]?: T[key];
      } | Iterable<{
        [key in TTrySet]?: T[key];
      }>);
    }>) => ({
      [cgKey in TCanGet]: TryResult<T, 'canGet', cgKey>;
    } & {
        [tsKey in TTrySet]: TryResult<T, 'trySet', tsKey>;
      }))
  & (

    /**
     * A property/method that can be used to attempt to set or access a property that has potentially been warded.
     * A missing method or property will return the same as a hidden method or property.
     *
     * @param to - The operation to attempt to perform.
     * @param propKey - The property key to attempt to get or set.
     *
     * @returns An object containing the results of the attempted gets and sets in the format: [value: T[propKey] | undefined, canGet: Ward.Can].
     */
    <TPropKey extends keyof T>(to: typeof Ward.Can.Get, propKey: TPropKey) => TryResult<T, 'canGet'>)
  & (

    /**
     * A property/method that can be used to attempt to set or access a property that has potentially been warded.
     * A missing method or property will return the same as a hidden method or property.
     *
     * @param to - The operation to attempt to perform.
     * @param propKey - The property key to attempt to get or set.
     *
     * @returns An object containing the results of the attempted gets and sets in the format: [value: T[propKey] | undefined, canGet: Ward.Can].
     */
    <TPropKey extends keyof T>(to: typeof Ward.Can.Set, propKey: TPropKey) => TryResult<T, 'canSet'>)
  & (

    /**
     * A property/method that can be used to attempt to set or access a property that has potentially been warded.
     * A missing method or property will return the same as a hidden method or property.
     *
     * @param to - The operation to attempt to perform.
     * @param propKey - The property key to attempt to get or set.
     * @param value - The value to set the property to. If not provided, nothing will try to be set (you can't even provide undefined!) (only used when `to` is set to `Ward.Can.Set`)
     *
     * @returns An object containing the results of the attempted gets and sets in the format: [value: T[propKey] | undefined, canGet: Ward.Can].
     */
    <TPropKey extends keyof T, TOperation extends Ward.Can>(
      to: TOperation,
      propKey: TPropKey,
      value: (TOperation extends typeof Ward.Can.Set
        ? T[TPropKey]
        : never)
    ) => TryResult<T, 'trySet'>)

  & {
    [key in _keyofTExceptConstructor<T>]?: T[key];
  }
);

/**
 * A type that can be used to make a property read-only.
 */
type Ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>,
>
  = (TPropKeysToOmit extends keyof T
    ? Omit<ProtectedWardPropertiesOf<T, TPropKeysToProtect>, TPropKeysToOmit>
    : ProtectedWardPropertiesOf<T, TPropKeysToProtect>)
  & {

    /**
     * A property/method that can be used to attempt to set or access a property that has potentially been warded.
     * A missing method or property will return the same as a hidden method or property.
     */
    try: WardTryer<T>
    [$WARD]: {
      config: WardConfig<T, WardableKeysOf<T>, WardableKeysOf<T>>;
      try: WardTryer<T>;
    }
  };

// nested types
namespace Ward {
  /** @alias {@link WardPropertyAccess} */
  export type Can
    = WardPropertyAccess;

  /** @alias {@link WardConfig} */
  export type Config<
    T extends object,
    TPropKeysToOmit extends WardableKeysOf<T> = unknown,
    TPropKeysToProtect extends WardableKeysOf<T> = unknown,
  > = WardConfig<T, TPropKeysToOmit, TPropKeysToProtect>;

  /** @alias {@link HasWardConfig} */
  export type HasConfig<T extends object>
    = HasWardConfig<T>;

  /** @alias {@link WardConfigOf} */
  export type ConfigOf<T extends object>
    = WardConfigOf<T>;

  /** @alias {@link HasDefaultHiddenKeys} */
  export type HasDefaultHiddenKeys<T extends object>
    = _HasDefaultHiidenKeys<T>;

  /** @alias {@link DefaultHiddenKeysOf} */
  export type DefaultHiddenKeysOf<T extends object>
    = _DefaultHiddenKeysOf<T>;

  /** @alias {@link HasDefaultProtectedKeys} */
  export type HasDefaultProtectedKeys<T extends object>
    = _HasDefaultProtectedKeys<T>;

  /** @alias {@link DefaultProtectedKeysOf} */
  export type DefaultProtectedKeysOf<T extends object>
    = _DefaultProtectedKeysOf<T>;

  /** @alias {@link ProtectedWardPropertiesOf} */
  export type ProtectedPropertiesOf<T extends object>
    = ProtectedWardPropertiesOf<T>;

  /** @alias {@link HiddenWardPropertiesOf} */
  export type HiddenPropertiesOf<T extends object>
    = HiddenWardPropertiesOf<T>;
}


export default Ward;
export { Ward };

/**
 * The result of a try operation.
 */
export type TryResult<
  T extends object,
  TOperation extends 'canGet' | 'canSet' | 'trySet' = any,
  key extends keyof T = keyof T
>
  = [value: T[key] | undefined, success: boolean]
  & { value?: T[key] }
  & { success: boolean }
  & (TOperation extends 'canGet'
    ? { canGet: boolean }
    : (TOperation extends 'canSet'
      ? { canSet: boolean }
      : (TOperation extends 'trySet'
        ? { wasSet: boolean }
        : never)));

//#region type helpers

/**
 * All potentially wardable keys for a given type.
 */
export type WardableKeysOf<T extends object>
  = (keyof T | undefined | unknown);

/**
 * Used to get the default hidden keys for a given type.
 */
export type DefaultHiddenKeysOf<
  T extends object
> = HasWardConfig<T> extends true
  ? (WardConfigOf<T> extends { DEFAULT_HIDDEN_KEYS: any }
    ? WardConfigOf<T>["DEFAULT_HIDDEN_KEYS"][any]
    : unknown)
  : unknown;

type _DefaultHiddenKeysOf<T extends object>
  = DefaultHiddenKeysOf<T>;

/**
 * Used to get the default hidden keys for a given type.
 */
export type DefaultProtectedKeysOf<
  T extends object
> = HasWardConfig<T> extends true
  ? (WardConfigOf<T> extends { DEFAULT_PROTECTED_KEYS: any }
    ? WardConfigOf<T>["DEFAULT_PROTECTED_KEYS"][any]
    : unknown)
  : unknown;

type _DefaultProtectedKeysOf<T extends object>
  = DefaultProtectedKeysOf<T>;

/**
 * Get a representation of the protected ward properties of a type.
 */
export type ProtectedWardPropertiesOf<T extends object, TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>>
  = TPropKeysToProtect extends keyof T
  ? Readonly<Pick<T, TPropKeysToProtect>>
  : {}

/**
 * Get a representation of the properties that will be omitted from a type.
 */
export type HiddenWardPropertiesOf<T extends object, TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>>
  = TPropKeysToOmit extends keyof T
  ? Pick<T, TPropKeysToOmit>
  : {}

/**
 * Get a representation of the protected ward properties of a type.
 */
export type ProtectWardPropertiesOf<T extends object, TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>>
  = TPropKeysToProtect extends keyof T
  ? Protect<T, TPropKeysToProtect>
  : {}

/**
 * Get a representation of the properties that will be omitted from a type.
 */
export type HideWardPropertiesOf<T extends object, TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>>
  = TPropKeysToOmit extends keyof T
  ? Omit<T, TPropKeysToOmit>
  : T

type _keyofTExceptConstructor<T>
  = keyof Omit<T, 'constructor'>

//#endregion

//#region type guards

/**
 * Type guard for checking if an object's class has a ward config.
 */
export function hasWardConfig<
  T extends object
>(value: T): value is T & IHaveWardConfig<T> {
  if (value.constructor.hasOwnProperty($WARD)) {
    return true;
  }

  return false;
}

//#endregion

//#endregion

//#region config

//#region config types

/**
 * A config for a ward
 */
export type WardConfig<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = unknown,
  TPropKeysToProtect extends WardableKeysOf<T> = unknown,
> = RequireAtLeastOne<{
  readonly DEFAULT_HIDDEN_KEYS: ReadonlyArray<TPropKeysToOmit>;
  readonly DEFAULT_PROTECTED_KEYS: ReadonlyArray<TPropKeysToProtect>;
}>;

/**
 * Used on a class with a ward config.
 * 
 * You can use the decorator {@link implementsWardConfig} to implement this interface staticly on a class.
 */
export interface IHaveWardConfig<T extends object> {
  constructor: Function & {
    readonly [$WARD]: WardConfig<T>;
  }
}

//#endregion

//#region config type helpers

/**
 * Can check if a given object has a Ward configuration in it's class.
 */
export type HasWardConfig<
  T extends object
> = T extends IHaveWardConfig<T>
  ? true
  : false;

/**
 * Can check if a given object has a Ward configuration with default hidden keys.
 */
export type HasDefaultHiddenKeys<
  T extends object
> = HasWardConfig<T> extends true
  ? (WardConfigOf<T> extends { DEFAULT_HIDDEN_KEYS: any }
    ? true
    : false)
  : false;

type _HasDefaultHiidenKeys<T extends object>
  = HasDefaultHiddenKeys<T>;

/**
 * Can check if a given object has a Ward configuration with default hidden keys.
 */
export type HasDefaultProtectedKeys<
  T extends object
> = HasWardConfig<T> extends true
  ? (WardConfigOf<T> extends { DEFAULT_PROTECTED_KEYS: any }
    ? true
    : false)
  : false;

type _HasDefaultProtectedKeys<T extends object>
  = HasDefaultProtectedKeys<T>;

/**
 * Gets the default ward config of a given object (from it's class)
 */
export type WardConfigOf<
  T extends object
> = T extends IHaveWardConfig<T>
  ? T["constructor"][typeof $WARD]
  : undefined;

//#endregion

//#endregion

//#region builder function

/**
 * Used to 'ward' an object.
 * 
 * @see {@link Ward}
 */
function ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
>(
  target: T,
  hiddenKeys?: ReadonlyArray<TPropKeysToOmit>,
  protectedKeys?: ReadonlyArray<TPropKeysToProtect>,
): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

function ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
>(
  target: T,
  options: RequireAtLeastOne<{
    readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
    readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
  }>
): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

function ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>
>(
  target: T,
  ...wards: readonly [hiddenKeys?: ReadonlyArray<TPropKeysToOmit>, protectedKeys?: ReadonlyArray<TPropKeysToProtect>]
    | readonly [{ readonly hiddenKeys?: ReadonlyArray<TPropKeysToOmit>, readonly protectedKeys?: ReadonlyArray<TPropKeysToProtect> }]
): Ward<T, TPropKeysToOmit, TPropKeysToProtect> {
  let hiddenKeys: ReadonlyArray<TPropKeysToOmit> | undefined;
  let protectedKeys: ReadonlyArray<TPropKeysToProtect> | undefined;

  if (wards[0]?.is(Array)) {
    hiddenKeys = wards[0] as ReadonlyArray<TPropKeysToOmit> | undefined;
    protectedKeys = wards[1] as ReadonlyArray<TPropKeysToProtect> | undefined;
  } else if (wards[0]?.isObject()) {
    hiddenKeys = wards[0].hiddenKeys as ReadonlyArray<TPropKeysToOmit> | undefined;
    protectedKeys = wards[0].protectedKeys as ReadonlyArray<TPropKeysToProtect> | undefined;
  }

  if (hasWardConfig(target)) {
    if (!hiddenKeys) {
      hiddenKeys
        = target.constructor[$WARD]
          ?.DEFAULT_HIDDEN_KEYS as ReadonlyArray<TPropKeysToOmit>;
    }

    if (!protectedKeys) {
      protectedKeys
        = target.constructor[$WARD]
          ?.DEFAULT_PROTECTED_KEYS as ReadonlyArray<TPropKeysToProtect>;
    }
  }

  if (!hiddenKeys && !protectedKeys) {
    return target as Ward<T, TPropKeysToOmit, TPropKeysToProtect>;
  }

  // wrap the target in a proxy that will return undefined for any property
  const ward = new Proxy(target, {
    get: (target, prop) => {
      if (hiddenKeys?.includes(<keyof T>prop as TPropKeysToOmit)) {
        return undefined;
      } else {
        return (<T>target)[<keyof T>prop];
      }
    },
    set: (target, prop, value) => {
      if (hiddenKeys?.includes(prop as TPropKeysToOmit)
        || protectedKeys?.includes(prop as TPropKeysToProtect)) {
        return false;
      } else {
        (<T>target)[<keyof T>prop] = value;
        return true;
      }
    }
  }) as Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

  // build the 'try' object/method:
  const tryer = function tryTo(
    ...args: Parameters<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>
  ): ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]> {
    if ((args[0] as Ward.Can) in Ward.Can) {
      // set:
      if ((args[0] as Ward.Can) & Ward.Can.Set) {
        if (args.length === 3) {
          if (protectedKeys?.includes(args[1] as TPropKeysToProtect)
            || hiddenKeys?.includes(args[1] as TPropKeysToOmit)
            || !target.hasOwnProperty(args[1] as keyof T)
          ) {
            // result (fail)
            const result: TryResult<T> = [undefined, false] as TryResult<T, 'trySet'>;
            result.wasSet = false;
            result.success = false;
            result.value = undefined;

            return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
          } else {
            // set
            target[args[1] as keyof T] = args[2] as T[keyof T];

            // result (success)
            const result: TryResult<T> = [target[args[1] as keyof T], true] as TryResult<T, 'trySet'>;
            result.wasSet = true;
            result.success = true;
            result.value = result[0] as T[keyof T];

            return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
          }
        } else {
          if (protectedKeys?.includes(args[1] as TPropKeysToProtect)
            || hiddenKeys?.includes(args[1] as TPropKeysToOmit)
            || !target.hasOwnProperty(args[1] as keyof T)
          ) {
            // result (fail)
            const result: TryResult<T> = [undefined, false] as TryResult<T, 'canSet'>;
            result.canSet = false;
            result.success = false;
            result.value = undefined;

            return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
          } else {
            // result (success; no-set)
            const result: TryResult<T> = [target[args[1] as keyof T], true] as TryResult<T, 'canSet'>;
            result.canSet = true;
            result.success = true;
            result.value = result[0] as T[keyof T];

            return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
          }
        }
      }

      // get
      if ((args[0] as Ward.Can) & Ward.Can.Get) {
        if (hiddenKeys?.includes(args[1] as TPropKeysToOmit)
          || !target.hasOwnProperty(args[1] as keyof T)
        ) {
          // result (fail)
          const result: TryResult<T> = [undefined, false] as TryResult<T, 'canGet'>;
          result.canGet = false;
          result.success = false;
          result.value = undefined;

          return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
        } else {
          // result (success)
          const result: TryResult<T> = [target[args[1] as keyof T], true] as TryResult<T, 'canGet'>;
          result.canGet = true;
          result.success = true;
          result.value = result[0] as T[keyof T];

          return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
        }
      }

      throw new Error("Invalid ward.try operation: " + args[0] + "'");
    }
    else if (args[0]?.isObject()) {
      const toSet = [] as (keyof T | [keyof T, any])[];
      const toGet = [] as (keyof T)[];

      if (args[0]?.hasOwnProperty("set")) {
        if (args[0]?.set?.isNonStringIterable()) {
          for (const prop of args[0].set as Iterable<_keyofTExceptConstructor<T> | { [key in _keyofTExceptConstructor<T>]: T[key] }>) {
            if (prop.isObject()) {
              for (const key in prop) {
                toSet.push([key, prop[key as Exclude<keyof T, 'constructor'>]] as [keyof T, any]);
              }
            } else {
              toSet.push(prop);
            }
          }
        } else {
          for (const key in args[0].set as { [key in _keyofTExceptConstructor<T>]: T[key] }) {
            toSet.push([key, (args[0].set as { [key in _keyofTExceptConstructor<T>]: T[key] })[key as Exclude<keyof T, 'constructor'>]] as [keyof T, any]);
          }
        }
      }

      if (args[0]?.hasOwnProperty("get")) {
        Loop.through(toGet.push.bind(toGet), args[0].get as Iterable<_keyofTExceptConstructor<T>>);
      }

      const results
        = {} as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;

      for (const s of toSet) {
        if (s.is(Array)) {
          if ((results as object).hasOwnProperty(s[0] as string)) {
            (results as any)[s[0] as any]
              = _mergeResults(
                ward.try(Ward.Can.Set, s[0], s[1]),
                (results as any)[s[0] as any],
              );
          } else {
            (results as any)[s[0] as any]
              = ward.try(Ward.Can.Set, s[0], s[1]);
          }
        } else {
          if ((results as object).hasOwnProperty(s as string)) {
            (results as any)[s as any]
              = _mergeResults(
                ward.try(Ward.Can.Set, s),
                (results as any)[s as any],
              );
          } else {
            (results as any)[s] = ward.try(Ward.Can.Set, s);
          }
        }
      }

      for (const g of toGet) {
        if ((results as object).hasOwnProperty(g as string)) {
          (results as any)[g as any]
            = _mergeResults(
              ward.try(Ward.Can.Get, g),
              (results as any)[g as any],
            );
        } else {
          (results as any)[g] = ward.try(Ward.Can.Get, g);
        }
      }

      return results;
    } else {
      throw new Error("Invalid ward.try arguments: " + args + "'");
    }
  }

  // general try function
  let proxy: typeof tryer;
  Object.defineProperty(ward, "try", {
    get() {
      if (!proxy) {
        _initTryProxy();
      }

      return proxy;
    },
    enumerable: false
  });

  // as trait
  const $ward = {};
  Object.defineProperty($ward, "try", {
    get() {
      if (!proxy) {
        _initTryProxy();
      }

      return proxy;
    },
    enumerable: false,
    configurable: false
  });
  Object.defineProperty(ward, $WARD, {
    get() {
      return $ward;
    },
    enumerable: false,
    configurable: false
  });

  return ward;

  function _initTryProxy() {
    proxy = new Proxy(tryer, {
      get: (_, prop) => {
        if (hiddenKeys?.includes(<keyof T>prop as TPropKeysToOmit)) {
          return undefined;
        } else {
          if (target.hasOwnProperty(prop)) {
            return target[<keyof T>prop];
          } else {
            return undefined;
          }
        }
      }
    });
  }

  function _mergeResults(...results: [TryResult<T>, TryResult<T>]): TryResult<T> {
    const result = [
      results[0][0] ?? results[1][0],
      results[0][1] && results[1][1]
    ] as TryResult<any>;

    result.value = results[0].value ?? results[1].value;
    result.success = results[0].success && results[1].success;

    if (results[0].hasOwnProperty("canGet")
      || results[1].hasOwnProperty("canGet")) {
      (result as { canGet?: boolean }).canGet
        = (results[0] as { canGet?: boolean }).canGet === undefined
          ? (results[1] as { canGet?: boolean }).canGet
          : ((results[0] as { canGet?: boolean }).canGet
            && ((results[1] as { canGet?: boolean }).canGet ?? true));
    }

    if (results[0].hasOwnProperty("canSet")
      || results[1].hasOwnProperty("canSet")) {
      (result as { canSet?: boolean }).canSet
        = (results[0] as { canSet?: boolean }).canSet === undefined
          ? (results[1] as { canSet?: boolean }).canSet
          : ((results[0] as { canSet?: boolean }).canSet
            && ((results[1] as { canSet?: boolean }).canSet ?? true));
    }

    if (results[0].hasOwnProperty("canGet")
      || results[1].hasOwnProperty("canGet")) {
      (result as { canGet?: boolean }).canGet
        = (results[0] as { canGet?: boolean }).canGet === undefined
          ? (results[1] as { canGet?: boolean }).canGet
          : ((results[0] as { canGet?: boolean }).canGet
            && ((results[1] as { canGet?: boolean }).canGet ?? true));
    }

    if (results[0].hasOwnProperty("wasSet")
      || results[1].hasOwnProperty("wasSet")) {
      (result as { wasSet?: boolean }).wasSet
        = (results[0] as { wasSet?: boolean }).wasSet === undefined
          ? (results[1] as { wasSet?: boolean }).wasSet
          : ((results[0] as { wasSet?: boolean }).wasSet
            && ((results[1] as { wasSet?: boolean }).wasSet ?? true));
    }

    return result;
  }
}

ward.CONFIG_KEY
  = $WARD;

ward.hasConfig
  = hasWardConfig;

ward.implementsConfig
  = implementsWardConfig;

ward.Can
  = WardPropertyAccess;

ward.from
  = ward;

ward.isWard
  = isWard;

ward.has
  = isWarded;

ward.isNot
  = isNotWarded

export { ward };

//#endregion