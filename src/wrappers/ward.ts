import { RequireAtLeastOne, RequireOnlyOne } from "../types/or";
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

//#region decorators

/**
 * Used to indicate a class has a default warding configuration.
 * 
 * @decorator class
 * @alias {@link implementsStatic<Ward.ClassWithConfig<T>>}
 */
export const implementsWardConfig = <
  TClass extends Class<T>,
  T extends ClassWithWardConfig<T> = InstanceType<TClass>
>(
  cls: TClass,
  _: any
  // make the extended constructor a requirement of the class itself:
) => { cls };

//#endregion

//#region functional implementation

/**
 * Used to 'ward' an object.
 * 
 * @see {@link Ward}
 */
function ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
>(
  target: T,
  hiddenKeys?: ReadonlyArray<TPropKeysToOmit>,
  protectedKeys?: ReadonlyArray<TPropKeysToProtect>,
): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

function ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
>(
  target: T,
  options: RequireAtLeastOne<{
    readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
    readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
  }>
): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;

function ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
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
            const result: Ward.TryResult<T> = [undefined, false] as Ward.TryResult<T, 'trySet'>;
            result.wasSet = false;
            result.success = false;
            result.value = undefined;

            return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
          } else {
            // set
            target[args[1] as keyof T] = args[2] as T[keyof T];

            // result (success)
            const result: Ward.TryResult<T> = [target[args[1] as keyof T], true] as Ward.TryResult<T, 'trySet'>;
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
            const result: Ward.TryResult<T> = [undefined, false] as Ward.TryResult<T, 'canSet'>;
            result.canSet = false;
            result.success = false;
            result.value = undefined;

            return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
          } else {
            // result (success; no-set)
            const result: Ward.TryResult<T> = [target[args[1] as keyof T], true] as Ward.TryResult<T, 'canSet'>;
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
          const result: Ward.TryResult<T> = [undefined, false] as Ward.TryResult<T, 'canGet'>;
          result.canGet = false;
          result.success = false;
          result.value = undefined;

          return result as ReturnType<Ward<T, TPropKeysToOmit, TPropKeysToProtect>["try"]>;
        } else {
          // result (success)
          const result: Ward.TryResult<T> = [target[args[1] as keyof T], true] as Ward.TryResult<T, 'canGet'>;
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
          for (const prop of args[0].set as Iterable<KeyofTExceptCtor<T> | { [key in KeyofTExceptCtor<T>]: T[key] }>) {
            if (prop.isObject()) {
              for (const key in prop) {
                toSet.push([key, prop[key as Exclude<keyof T, 'constructor'>]] as [keyof T, any]);
              }
            } else {
              toSet.push(prop);
            }
          }
        } else {
          for (const key in args[0].set as { [key in KeyofTExceptCtor<T>]: T[key] }) {
            toSet.push([key, (args[0].set as { [key in KeyofTExceptCtor<T>]: T[key] })[key as Exclude<keyof T, 'constructor'>]] as [keyof T, any]);
          }
        }
      }

      if (args[0]?.hasOwnProperty("get")) {
        Loop.through(toGet.push.bind(toGet), args[0].get as Iterable<KeyofTExceptCtor<T>>);
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

  function _mergeResults(...results: [Ward.TryResult<T>, Ward.TryResult<T>]): Ward.TryResult<T> {
    const result = [
      results[0][0] ?? results[1][0],
      results[0][1] && results[1][1]
    ] as Ward.TryResult<any>;

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

//#endregion

//#region constructor implementation

/**
 * A function that can be used to create a new ward for a target.
 */
function WardConstructor<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
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

//#region guards

export function isWard<
  T extends object
>(
  value: unknown,
): value is Ward<T> {
  return value?.hasOwnProperty($WARD) ?? false;
}

/**
 * Used to check if a value, and/or a value's specific properties are warded.
 */
export function isWarded<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
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
export function isNotWarded<
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

/**
 * Type guard for checking if an object's class has a ward config.
 */
export function hasWardConfig<
  T extends object
>(value: T): value is T & Ward.ClassWithConfig<T> {
  if (value.constructor.hasOwnProperty($WARD)) {
    return true;
  }

  return false;
}

//#endregion

//#region types

/**
 * A type that can be used to make a property read-only.
 */
type Ward<
  T extends object,
  TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
  TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>,
>
  = (TPropKeysToOmit extends keyof T
    ? Omit<Ward.ProtectedPropertiesOf<T, TPropKeysToProtect>, TPropKeysToOmit>
    : Ward.ProtectedPropertiesOf<T, TPropKeysToProtect>)
  & {

    /**
     * A property/method that can be used to attempt to set or access a property that has potentially been warded.
     * A missing method or property will return the same as a hidden method or property.
     */
    try: WardTryer<T>
    [$WARD]: {
      config: Ward.Config<T, WardableKeysOf<T>, WardableKeysOf<T>>;
      try: WardTryer<T>;
    }
  };

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
    TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
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
    TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
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
    TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
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
    TPropKeysToOmit extends WardableKeysOf<T> = Ward.DefaultHiddenKeysOf<T>,
    TPropKeysToProtect extends WardableKeysOf<T> = Ward.DefaultProtectedKeysOf<T>
  >(
    target: T,
    options: RequireAtLeastOne<{
      readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>,
      readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>
    }>
  ): Ward<T, TPropKeysToOmit, TPropKeysToProtect>;
}

/**
 * All potentially wardable keys for a given type.
 */
export type WardableKeysOf<T extends object>
  = (keyof T | undefined | unknown);

// nested types
namespace Ward {

  /** @alias {@link WardPropertyAccess} */
  export type Can
    = WardPropertyAccess;

  /**
   * The result of a try operation.
   */
  export type TryResult<
    T extends object,
    TOperation extends 'canGet' | 'canSet' | 'trySet' = any,
    TKey extends keyof T = keyof T
  >
    = [value: T[TKey] | undefined, success: boolean]
    & { value?: T[TKey] }
    & { success: boolean }
    & (TOperation extends 'canGet'
      ? { canGet: boolean }
      : (TOperation extends 'canSet'
        ? { canSet: boolean }
        : (TOperation extends 'trySet'
          ? { wasSet: boolean }
          : never)));

  //#region config types

  /**
   * A config for a ward
   */
  export type Config<
    T extends { [key in WardableKeysOf<T> extends unknown ? never : WardableKeysOf<T>]: any },
    TPropKeysToOmit extends WardableKeysOf<T> = unknown,
    TPropKeysToProtect extends WardableKeysOf<T> = unknown,
    TAlterations extends { readonly [key in keyof T]?: Alter<unknown, T, key> } | undefined = undefined
  > = RequireAtLeastOne<{
    readonly DEFAULT_HIDDEN_KEYS: ReadonlyArray<TPropKeysToOmit>;
    readonly DEFAULT_PROTECTED_KEYS: ReadonlyArray<TPropKeysToProtect>;
    readonly DEFAULT_ALTERATIONS: TAlterations;
    readonly DEFAULT_FACADES: ReadonlyArray<Facade<T, Exclude<keyof T, TPropKeysToOmit>>>;
  }>;

  /**
   * Used on a class with a ward config.
   * 
   * You can use the decorator {@link implementsWardConfig} to implement this interface staticly on a class.
   */
  export interface ClassWithConfig<T extends object> {
    constructor: Function & {
      readonly [$WARD]: Config<T>;
    }
  }

  /**
   * A way to proxy a field during ward creation.
   */
  export interface Facade<
    TObject extends { [key in TKey]: any },
    TKey extends string | number | symbol
  > {
    key: TKey,
    value?: TObject[TKey],
    get?: (thisArg: TObject) => TObject[TKey],
    set?: (thisArg: TObject, value: TObject[TKey]) => boolean,
  }

  /**
   * A way to modify a field during ward creation.
   */
  export type Alter<
    TEditedProp,
    TObject,
    TKey extends string | number | symbol | unknown,
  > = {
    key: TKey
  }
    & (
      (
        { edit?: (thisArg: TObject, current: TEditedProp) => TEditedProp }
        | { value?: TEditedProp }
      )
      | RequireAtLeastOne<{
        get: (thisArg: TObject) => TEditedProp,
        set: (thisArg: TObject, value: TEditedProp) => boolean
      }>
    )

  /**
   * Can check if a given object has a Ward configuration in it's class.
   */
  export type HasConfig<
    T extends object
  > = T extends ClassWithConfig<T>
    ? true
    : false;

  /**
   * Gets the default ward config of a given object (from it's class)
   */
  export type ConfigOf<
    T extends object
  > = T extends ClassWithConfig<T>
    ? T["constructor"][typeof $WARD]
    : undefined;

  /** @alias {@link WardableKeysOf} */
  export type GetPotentialKeysOf<T extends object>
    = WardableKeysOf<T>;

  /**
   * Can check if a given object has a Ward configuration with default hidden keys.
   */
  export type HasDefaultHiddenKeys<
    T extends object
  > = HasConfig<T> extends true
    ? (ConfigOf<T> extends { DEFAULT_HIDDEN_KEYS: any }
      ? true
      : false)
    : false;

  /**
   * Used to get the default hidden keys for a given type.
   */
  export type DefaultHiddenKeysOf<
    T extends object
  > = HasConfig<T> extends true
    ? (ConfigOf<T> extends { DEFAULT_HIDDEN_KEYS: any }
      ? ConfigOf<T>["DEFAULT_HIDDEN_KEYS"][any]
      : unknown)
    : unknown;


  /**
   * Get a representation of the properties that will be omitted from a type.
   */
  export type HiddenPropertiesOf<T extends object, TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>>
    = TPropKeysToOmit extends keyof T
    ? Pick<T, TPropKeysToOmit>
    : {}

  /**
   * Get a representation of the properties that will be omitted from a type.
   */
  export type HidePropertiesOf<T extends object, TPropKeysToOmit extends WardableKeysOf<T> = DefaultHiddenKeysOf<T>>
    = TPropKeysToOmit extends keyof T
    ? Omit<T, TPropKeysToOmit>
    : T

  /**
   * Can check if a given object has a Ward configuration with default hidden keys.
   */
  export type HasDefaultProtectedKeys<
    T extends object
  > = HasConfig<T> extends true
    ? (ConfigOf<T> extends { DEFAULT_PROTECTED_KEYS: any }
      ? true
      : false)
    : false;

  /**
   * Used to get the default hidden keys for a given type.
   */
  export type DefaultProtectedKeysOf<
    T extends object
  > = HasConfig<T> extends true
    ? (ConfigOf<T> extends { DEFAULT_PROTECTED_KEYS: any }
      ? ConfigOf<T>["DEFAULT_PROTECTED_KEYS"][any]
      : unknown)
    : unknown;

  /**
 * Get a representation of the protected ward properties of a type.
 */
  export type ProtectedPropertiesOf<T extends object, TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>>
    = TPropKeysToProtect extends keyof T
    ? Readonly<Pick<T, TPropKeysToProtect>>
    : {}

  /**
   * Get a representation of the protected ward properties of a type.
   */
  export type ProtectPropertiesOf<T extends object, TPropKeysToProtect extends WardableKeysOf<T> = DefaultProtectedKeysOf<T>>
    = TPropKeysToProtect extends keyof T
    ? Protect<T, TPropKeysToProtect>
    : {}

  //#endregion

}

//#region flat type exports

/** @alias {@link Ward.TryResult} */
export type TryResult<
  T extends object,
  TOperation extends 'canGet' | 'canSet' | 'trySet' = any,
  TKey extends keyof T = keyof T
> = Ward.TryResult<T, TOperation, TKey>;

/** @alias {@link Ward.Config} */
export type WardConfig<
  T extends { [key in WardableKeysOf<T> extends unknown ? never : WardableKeysOf<T>]: any },
  TPropKeysToOmit extends WardableKeysOf<T> = unknown,
  TPropKeysToProtect extends WardableKeysOf<T> = unknown,
  TAlterations extends { readonly [key in KeyofTExceptCtor<T>]?: Alter<unknown, T, key> } | undefined = undefined
> = Ward.Config<T, TPropKeysToOmit, TPropKeysToProtect, TAlterations>;

/** @alias {@link Ward.Facade} */
export interface Facade<
  TObject extends { [key in TKey]: any },
  TKey extends string | number | symbol
> extends Ward.Facade<TObject, TKey> { }

/** @alias {@link Ward.Alter} */
export type Alter<
  TEditedProp,
  TObject,
  TKey extends string | number | symbol,
> = Ward.Alter<TEditedProp, TObject, TKey>;

/** @alias {@link Ward.ConfigOf} */
export type WardConfigOf<
  T extends object
> = Ward.ConfigOf<T>;

/** @alias {@link Ward.ClassWithConfig} */
export interface ClassWithWardConfig<T extends object>
  extends Ward.ClassWithConfig<T> { }

//#endregion

//#region internal type helpers

type KeyofTExceptCtor<T>
  = keyof Omit<T, 'constructor'>

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
    <TCanGet extends KeyofTExceptCtor<T> = never, TCanSet extends KeyofTExceptCtor<T> = never>(to: RequireAtLeastOne<{
      get: Iterable<TCanGet>;
      set: Iterable<TCanSet>;
    }>) => ({
      [cgKey in TCanGet]: Ward.TryResult<T, 'canGet', cgKey>;
    } & {
        [csKey in TCanSet]: Ward.TryResult<T, 'canSet', csKey>;
      }))
  & (

    /**
     * Attempt to get or set the given potentially warded properties.
     *
     * @param to - An object containing the properties to attempt to get or set.
     *
    * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
     */
    <TCanGet extends KeyofTExceptCtor<T> = never, TCanSet extends KeyofTExceptCtor<T> = never, TTrySet extends KeyofTExceptCtor<T> = never>(to: RequireAtLeastOne<{
      get: Iterable<TCanGet>;
      set: ({
        [key in TTrySet]?: T[key];
      } | Iterable<TCanSet | {
        [key in TTrySet]?: T[key];
      }>);
    }>) => ({
      [cgKey in TCanGet]: Ward.TryResult<T, 'canGet', cgKey>;
    } & {
        [csKey in TCanSet]: Ward.TryResult<T, 'canSet', csKey>;
      } & {
        [tsKey in TTrySet]: Ward.TryResult<T, 'trySet', tsKey>;
      }))
  & (

    /**
     * Attempt to get or set the given potentially warded properties.
     *
     * @param to - An object containing the properties to attempt to get or set.
     *
    * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
     */
    <TCanGet extends KeyofTExceptCtor<T> = never, TTrySet extends KeyofTExceptCtor<T> = never>(to: RequireAtLeastOne<{
      get: Iterable<TCanGet>;
      set: ({
        [key in TTrySet]?: T[key];
      } | Iterable<{
        [key in TTrySet]?: T[key];
      }>);
    }>) => ({
      [cgKey in TCanGet]: Ward.TryResult<T, 'canGet', cgKey>;
    } & {
        [tsKey in TTrySet]: Ward.TryResult<T, 'trySet', tsKey>;
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
    <TPropKey extends keyof T>(to: typeof Ward.Can.Get, propKey: TPropKey) => Ward.TryResult<T, 'canGet'>)
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
    <TPropKey extends keyof T>(to: typeof Ward.Can.Set, propKey: TPropKey) => Ward.TryResult<T, 'canSet'>)
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
    ) => Ward.TryResult<T, 'trySet'>)

  & {
    [key in KeyofTExceptCtor<T>]?: T[key];
  }
);

//#endregion

//#endregion

export { ward };
export default Ward;
export { Ward };