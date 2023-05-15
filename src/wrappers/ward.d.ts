import { RequireAtLeastOne } from '../types/or';
import { Class } from '../types/ctor';
import { Protect } from '../types/mod';
/**
 * The symbol used to index ward related-traits of a class or instance
 * // TODO: add to global keys section
 */
export declare const $WARD: unique symbol;
/**
 * Ways to access a property from a warded object usin 'try'
 */
declare enum WardPropertyAccess {
    /**
     * The property can't be found or accessed
     */
    None,
    /**
     * The property can be fetched
     */
    Get,
    /**
     * The property can be set
     */
    Set
}
/**
 * Ward property access levels.
 */
export { WardPropertyAccess as WardPropAccess };
/**
 * Used to 'ward' an object.
 *
 * @see {@link Ward}
 */
declare function ward<T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(target: T, hiddenKeys?: ReadonlyArray<TPropKeysToOmit>, protectedKeys?: ReadonlyArray<TPropKeysToProtect>, wardedChildren?: TChildWards): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
declare function ward<T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(target: T, options: RequireAtLeastOne<{
    readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>;
    readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>;
    readonly wardedChildren: Readonly<TChildWards>;
}>): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
declare namespace ward {
    var CONFIG_KEY: typeof $WARD;
    var hasConfig: typeof hasWardConfig;
    var Can: typeof WardPropertyAccess;
    var from: typeof ward;
    var isWard: typeof import("./ward").isWard;
    var has: typeof isWarded;
    var isNot: typeof isNotWarded;
    var implementsConfig: <TClass extends Class<T>, T extends unknown = InstanceType<TClass>>(cls: TClass, _: any) => void;
}
/**
 * A function that can be used to create a new ward for a target.
 */
declare function WardConstructor<T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(this: Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>, target: T, ...wards: readonly [
    hiddenKeys?: ReadonlyArray<TPropKeysToOmit>,
    protectedKeys?: ReadonlyArray<TPropKeysToProtect>,
    childWards?: ReadonlyArray<TChildWards>
] | readonly [
    RequireAtLeastOne<{
        readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>;
        readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>;
        readonly childWards: ReadonlyArray<TChildWards>;
    }>?
]): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
declare const Ward: WardConstructor;
export declare function isWard<T extends object>(value: unknown): value is Ward<T>;
/**
 * Used to check if a value, and/or a value's specific properties are warded.
 */
export declare function isWarded<T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>>(value: unknown, withHiddenKeys?: ReadonlyArray<TPropKeysToOmit>, withProtectedKeys?: ReadonlyArray<TPropKeysToProtect>): value is Ward<T, TPropKeysToOmit, TPropKeysToProtect>;
/**
 * Used to check if a value, or a value's specific properties are not warded.
 * defaults to making sure NOTHING is warded, if you want to check a specific property or subset of properties, you must pass them all in.
 */
export declare function isNotWarded<T extends object, TUnhiddenPropKeys extends keyof T | undefined = undefined, TUnprotectedPropKeys extends keyof T | undefined = undefined>(value: unknown, withUnHiddenKeys?: ReadonlyArray<TUnhiddenPropKeys>, withUnProtectedKeys?: ReadonlyArray<TUnprotectedPropKeys>): value is TUnhiddenPropKeys extends keyof T ? TUnprotectedPropKeys extends keyof T ? Pick<T, TUnhiddenPropKeys | TUnprotectedPropKeys> : Pick<T, TUnhiddenPropKeys> : T;
/**
 * Type guard for checking if an object's class has a ward config.
 */
export declare function hasWardConfig<T extends object>(value: T): value is T & Ward.ClassWithConfig<T>;
/**
 * A type that can be used to make a property read-only.
 */
type Ward<T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>> = {
    readonly [key in TPropKeysToProtect extends keyof T ? TPropKeysToProtect : never]: T[key];
} & {
    [key in keyof Omit<T, (TPropKeysToOmit extends string | number | symbol ? TPropKeysToOmit : never) | (TPropKeysToProtect extends string | number | symbol ? TPropKeysToProtect : never) | (keyof TChildWards extends string | number | symbol ? keyof TChildWards : never)>]: T[key];
} & (TChildWards extends {
    [key in Exclude<WardableKeysOf<T>, TPropKeysToOmit>]?: Ward.Config<T[key]>;
} ? {
    [key in keyof TChildWards]: Ward<(key extends keyof T ? (T[key] extends object ? T[key] : never) : never), TChildWards[key]>;
} : {}) & {
    /**
     * A property/method that can be used to attempt to set or access a property that has potentially been warded.
     * A missing method or property will return the same as a hidden method or property.
     */
    try: WardTryer<T>;
    /** @alias {@link try} */
    _: WardTryer<T>;
    [$WARD]: {
        config: Ward.Config<T, KeysToWard<T>, KeysToWard<T>>;
        try: WardTryer<T>;
    };
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
    new <T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(target: T, hiddenKeys?: ReadonlyArray<TPropKeysToOmit> | undefined, protectedKeys?: ReadonlyArray<TPropKeysToProtect>): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
    /**
     * A function that can be used to construct a new ward for a target.
     */
    new <T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(target: T, options: RequireAtLeastOne<{
        readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>;
        readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>;
    }>): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
    /**
     * A function that can be used to create a new ward from a target.
     */
    <T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(target: T, hiddenKeys?: ReadonlyArray<TPropKeysToOmit> | undefined, protectedKeys?: ReadonlyArray<TPropKeysToProtect>): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
    /**
     * A function that can be used to create a new ward from a target.
     */
    <T extends object, TPropKeysToOmit extends KeysToWard<T> = Ward.DefaultHiddenKeysOf<T>, TPropKeysToProtect extends KeysToWard<T> = Ward.DefaultProtectedKeysOf<T>, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = Ward.DefaultWardedChildrenOf<T>>(target: T, options: RequireAtLeastOne<{
        readonly hiddenKeys: ReadonlyArray<TPropKeysToOmit>;
        readonly protectedKeys: ReadonlyArray<TPropKeysToProtect>;
    }>): Ward<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
}
declare namespace Ward {
    /** @alias {@link WardPropertyAccess} */
    type Can = WardPropertyAccess;
    /**
     * The result of a try operation.
     */
    type TryResult<T extends object, TOperation extends 'canGet' | 'canSet' | 'trySet' = any, TKey extends keyof T = keyof T> = [
        value: T[TKey] | undefined,
        success: boolean
    ] & {
        value?: T[TKey];
    } & {
        success: boolean;
    } & (TOperation extends 'canGet' ? {
        canGet: boolean;
    } : TOperation extends 'canSet' ? {
        canSet: boolean;
    } : TOperation extends 'trySet' ? {
        wasSet: boolean;
    } : never);
    /**
     * A config for a ward
     */
    type Config<T extends {
        [key in WardableKeysOf<T>]: unknown;
    }, TPropKeysToOmit extends KeysToWard<T> = unknown, TPropKeysToProtect extends KeysToWard<T> = unknown, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = unknown> = RequireAtLeastOne<{
        readonly DEFAULT_HIDDEN_KEYS: ReadonlyArray<TPropKeysToOmit>;
        readonly DEFAULT_PROTECTED_KEYS: ReadonlyArray<TPropKeysToProtect>;
        readonly DEFAULT_CHILD_WARDS: TChildWards;
    }>;
    /**
     * Used on a class with a ward config.
     *
     * You can use the decorator {@link implementsWardConfig} to implement this interface staticly on a class.
     */
    interface ClassWithConfig<T extends object> {
        constructor: Function & {
            readonly [$WARD]: Config<T>;
        };
    }
    /**
     * A way to proxy a field during ward creation.
     */
    interface Facade<TObject extends {
        [key in TKey]: any;
    }, TKey extends string | number | symbol> {
        key: TKey;
        value?: TObject[TKey];
        get?: (thisArg: TObject) => TObject[TKey];
        set?: (thisArg: TObject, value: TObject[TKey]) => boolean;
    }
    /**
     * A way to modify a field during ward creation.
     */
    type Alter<TEditedProp, TObject, TKey extends string | number | symbol | unknown> = {
        key: TKey;
    } & (({
        edit?: (thisArg: TObject, current: TEditedProp) => TEditedProp;
    } | {
        value?: TEditedProp;
    }) | RequireAtLeastOne<{
        get: (thisArg: TObject) => TEditedProp;
        set: (thisArg: TObject, value: TEditedProp) => boolean;
    }>);
    /**
     * Can check if a given object has a Ward configuration in it's class.
     */
    type HasConfig<T extends object> = T extends ClassWithConfig<T> ? true : false;
    /**
     * Gets the default ward config of a given object (from it's class)
     */
    type ConfigOf<T extends object> = T extends ClassWithConfig<T> ? T['constructor'][typeof $WARD] : undefined;
    /** @alias {@link WardableKeysOf} */
    type GetPotentialKeysOf<T extends object> = WardableKeysOf<T>;
    /**
     * Can check if a given object has a Ward configuration with default hidden keys.
     */
    type HasDefaultHiddenKeys<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_HIDDEN_KEYS: any;
    } ? true : false : false;
    /**
     * Used to get the default hidden keys for a given type.
     */
    type DefaultHiddenKeysOf<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_HIDDEN_KEYS: any;
    } ? ConfigOf<T>['DEFAULT_HIDDEN_KEYS'][any] : unknown : unknown;
    /**
     * Get a representation of the properties that will be omitted from a type.
     */
    type HiddenPropertiesOf<T extends object, TPropKeysToOmit extends KeysToWard<T> = DefaultHiddenKeysOf<T>> = TPropKeysToOmit extends keyof T ? Pick<T, TPropKeysToOmit> : {};
    /**
     * Get a representation of the properties that will be omitted from a type.
     */
    type HidePropertiesOf<T extends object, TPropKeysToOmit extends KeysToWard<T> = DefaultHiddenKeysOf<T>> = TPropKeysToOmit extends keyof T ? Omit<T, TPropKeysToOmit> : T;
    /**
     * Can check if a given object has a Ward configuration with default hidden keys.
     */
    type HasDefaultProtectedKeys<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_PROTECTED_KEYS: any;
    } ? true : false : false;
    /**
     * Used to get the default hidden keys for a given type.
     */
    type DefaultProtectedKeysOf<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_PROTECTED_KEYS: any;
    } ? ConfigOf<T>['DEFAULT_PROTECTED_KEYS'][any] : unknown : unknown;
    /**
     * Get a representation of the protected ward properties of a type.
     */
    type ProtectedPropertiesOf<T extends object, TPropKeysToProtect extends KeysToWard<T> = DefaultProtectedKeysOf<T>> = TPropKeysToProtect extends keyof T ? Readonly<Pick<T, TPropKeysToProtect>> : {};
    /**
     * Get a representation of the protected ward properties of a type.
     */
    type ProtectPropertiesOf<T extends object, TPropKeysToProtect extends KeysToWard<T> = DefaultProtectedKeysOf<T>> = TPropKeysToProtect extends keyof T ? Protect<T, TPropKeysToProtect> : {};
    /**
     * Can check if a given object has a Ward configuration with default hidden keys.
     */
    type HasDefaultChildWards<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_ALTERATIONS: any;
    } ? true : false : false;
    /**
     * Used to get the default hidden keys for a given type.
     */
    type DefaultWardedChildrenKeysOf<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_ALTERATIONS: any;
    } ? keyof ConfigOf<T>['DEFAULT_ALTERATIONS'] : unknown : unknown;
    /**
     * Used to get the default wardec children props for a given type.
     */
    type DefaultWardedChildrenOf<T extends object> = HasConfig<T> extends true ? ConfigOf<T> extends {
        DEFAULT_ALTERATIONS: any;
    } ? ConfigOf<T>['DEFAULT_ALTERATIONS'] : unknown : unknown;
}
/**
 * All potentially wardable keys for a given type.
 */
export type WardableKeysOf<T extends object> = KeyofTExceptCtor<T>;
/**
 * Inputs for wardable keys for configs
 */
export type KeysToWard<T extends object> = WardableKeysOf<T> | undefined | unknown;
export type ChildrenToWard<T extends object, TPropKeysToOmit extends KeysToWard<T>> = {
    [key in Exclude<WardableKeysOf<T>, TPropKeysToOmit>]?: Ward.Config<T[key]>;
} | undefined | unknown;
/** @alias {@link Ward.TryResult} */
export type TryResult<T extends object, TOperation extends 'canGet' | 'canSet' | 'trySet' = any, TKey extends keyof T = keyof T> = Ward.TryResult<T, TOperation, TKey>;
/** @alias {@link Ward.Config} */
export type WardConfig<T extends {
    [key in WardableKeysOf<T>]: any;
}, TPropKeysToOmit extends KeysToWard<T> = unknown, TPropKeysToProtect extends KeysToWard<T> = unknown, TChildWards extends ChildrenToWard<T, TPropKeysToOmit> = unknown> = Ward.Config<T, TPropKeysToOmit, TPropKeysToProtect, TChildWards>;
/** @alias {@link Ward.ConfigOf} */
export type WardConfigOf<T extends object> = Ward.ConfigOf<T>;
/** @alias {@link Ward.ClassWithConfig} */
export interface ClassWithWardConfig<T extends object> extends Ward.ClassWithConfig<T> {
}
type KeyofTExceptCtor<T> = keyof Omit<T, 'constructor'>;
type WardTryer<T extends object> = 
/**
 * Attempt to get or set the given potentially warded properties.
 *
 * @param to - An object containing the properties to attempt to get or set.
 *
 * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
 */
(<TCanGet extends KeyofTExceptCtor<T> = never, TCanSet extends KeyofTExceptCtor<T> = never>(to: RequireAtLeastOne<{
    get: Iterable<TCanGet>;
    set: Iterable<TCanSet>;
}>) => {
    [cgKey in TCanGet]: Ward.TryResult<T, 'canGet', cgKey>;
} & {
    [csKey in TCanSet]: Ward.TryResult<T, 'canSet', csKey>;
}) & 
/**
 * Attempt to get or set the given potentially warded properties.
 *
 * @param to - An object containing the properties to attempt to get or set.
 *
 * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
 */
(<TCanGet extends KeyofTExceptCtor<T> = never, TCanSet extends KeyofTExceptCtor<T> = never, TTrySet extends KeyofTExceptCtor<T> = never>(to: RequireAtLeastOne<{
    get: Iterable<TCanGet>;
    set: {
        [key in TTrySet]?: T[key];
    } | Iterable<TCanSet | {
        [key in TTrySet]?: T[key];
    }>;
}>) => {
    [cgKey in TCanGet]: Ward.TryResult<T, 'canGet', cgKey>;
} & {
    [csKey in TCanSet]: Ward.TryResult<T, 'canSet', csKey>;
} & {
    [tsKey in TTrySet]: Ward.TryResult<T, 'trySet', tsKey>;
}) & 
/**
 * Attempt to get or set the given potentially warded properties.
 *
 * @param to - An object containing the properties to attempt to get or set.
 *
 * @returns An object containing the results of the attempted gets and sets in the format: {[propKey]: [value: T[propKey]| undefined, canGet: Ward.Can]}.
 */
(<TCanGet extends KeyofTExceptCtor<T> = never, TTrySet extends KeyofTExceptCtor<T> = never>(to: RequireAtLeastOne<{
    get: Iterable<TCanGet>;
    set: {
        [key in TTrySet]?: T[key];
    } | Iterable<{
        [key in TTrySet]?: T[key];
    }>;
}>) => {
    [cgKey in TCanGet]: Ward.TryResult<T, 'canGet', cgKey>;
} & {
    [tsKey in TTrySet]: Ward.TryResult<T, 'trySet', tsKey>;
}) & 
/**
 * A property/method that can be used to attempt to set or access a property that has potentially been warded.
 * A missing method or property will return the same as a hidden method or property.
 *
 * @param to - The operation to attempt to perform.
 * @param propKey - The property key to attempt to get or set.
 *
 * @returns An object containing the results of the attempted gets and sets in the format: [value: T[propKey] | undefined, canGet: Ward.Can].
 */
(<TPropKey extends keyof T>(to: typeof Ward.Can.Get, propKey: TPropKey) => Ward.TryResult<T, 'canGet'>) & 
/**
 * A property/method that can be used to attempt to set or access a property that has potentially been warded.
 * A missing method or property will return the same as a hidden method or property.
 *
 * @param to - The operation to attempt to perform.
 * @param propKey - The property key to attempt to get or set.
 *
 * @returns An object containing the results of the attempted gets and sets in the format: [value: T[propKey] | undefined, canGet: Ward.Can].
 */
(<TPropKey extends keyof T>(to: typeof Ward.Can.Set, propKey: TPropKey) => Ward.TryResult<T, 'canSet'>) & 
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
(<TPropKey extends keyof T, TOperation extends Ward.Can>(to: TOperation, propKey: TPropKey, value: TOperation extends typeof Ward.Can.Set ? T[TPropKey] : never) => Ward.TryResult<T, 'trySet'>) & {
    [key in KeyofTExceptCtor<T>]?: T[key];
};
/**
 * Used to indicate a class has a default warding configuration.
 *
 * @decorator class
 * @alias {@link implementsStatic<ClassWithWardConfig<T>>}
 */
export declare const implementsWardConfig: <TClass extends Class<T>, T extends unknown = InstanceType<TClass>>(cls: TClass, _: any) => void;
export { ward };
export default Ward;
export { Ward };
