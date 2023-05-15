/**
 * A key that can be used to try to acces the hook trait of a value.
 * // TODO: add to global keys section
 */
export declare const $HOOK: unique symbol;
/**
 * Interface for the implementation of the hook constructor
 */
interface HookConstructor {
    new <T>(value?: T): Hook<T>;
    /** @alias {@link $HOOK} */
    readonly SYMBOL: typeof $HOOK;
    /** @alias {@link isHook} */
    readonly is: typeof isHook;
}
/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 * The hook can also be used to listen for changes to the value.
 */
declare function HookConstructor<T>(this: Hook<T>, value: T): Hook<T>;
declare namespace HookConstructor {
    var SYMBOL: typeof $HOOK;
    var is: any;
}
declare const Hook: HookConstructor;
/**
 * A value that can be referenced by other hooks and listened to for changes.
 */
type Hook<T> = T & {
    [$HOOK]: {
        /**
         * The value this hook is presenting as.
         * > override ?? default ?? source?[AS_HOOK].value;
         */
        get value(): T;
        /**
         * Sets the value at the source.
         * > source?[AS_HOOK].value ??
         */
        set value(value: T);
        /**
         * Used to check if this hook is shadowing it's source value.
         */
        get hasOverride(): boolean;
        /**
         * Can be used to shadow the variable from the source.
         */
        get override(): T | undefined;
        /**
         * Shadow the source value with an override.
         * Reset this by setting it to undefined or calling reset()
         */
        set override(value: T | undefined);
        /**
         * The hook that this hook is pointing to/get's its values from
         */
        get source(): Hook<T> | undefined;
        /**
         * Used to set the source hook, which this hook should point to/get it's value from
         */
        set source(source: Hook<T> | undefined);
        /**
         * Used to interace with the onChange listeners/events.
         */
        get onChange(): OnHookChanged<T>;
        /**
         * Same as `.value =` but you can pass in context as well.
         *
         * @alias {@link value}
         */
        set(value: T, ctx?: {
            [key: string | number | symbol]: any;
        }): void;
        /**
         * Same as `.override =` but you can pass in context as well.
         *
         * @alias {@link override}
         */
        set(value: T, ctx: {
            [key: string | number | symbol]: unknown;
            override: true;
        }): void;
        /**
         * Reset the hook to mirror it's parent.
         * (clears the override value).
         */
        resync(): void;
    };
};
/**
 * Check if a value is a hook.
 */
export declare function isHook<T>(value: T): value is Hook<T>;
/**
 * Context for a hook onChange event that will be read by the attached listeners.
 */
export type HookEventContext<T> = {
    [key: string | number | symbol]: unknown;
    /**
     * If the value was changed via a reset() call, this will be true.
     */
    readonly wasReset?: boolean | false;
    /**
     * If the override of this hook was changed, this will be true
     */
    readonly asOverride?: boolean | false;
    /**
     * True if the value at the source was set from a connected hook
     * (the default of this is true)
     */
    readonly toSource?: boolean | true;
    /**
     * True if the value of this hook was updated from/by it's source
     */
    readonly fromSource?: boolean | false;
    /**
     * If the source was changed, this will be the new source:
     */
    readonly newSource?: Hook<T> | undefined;
    /**
     * If the source was changed, this will be the old source:
     */
    readonly oldSource?: Hook<T> | undefined;
};
/**
 * Details for an onChange event for a hook value.
 */
export type HookEvent<T> = {
    value: T | undefined;
    oldValue: T | undefined;
    ctx?: HookEventContext<T>;
};
/**
 * Interface for a hook onChange event listener.
 */
export interface HookListener<T> {
    (e: HookEvent<T>): void;
}
/**
 * onChange object for a hook.
 *
 * Used to call onChange listener logic, and to add new listeners with {@link add}
 */
type OnHookChanged<T> = HookListener<T> & Readonly<{
    /**
     * Add a new hook event listener
     */
    add(listener: HookListener<T>): void;
    /**
     * A change was made to the source value
     */
    (e: {
        value: T | undefined;
        oldValue: T | undefined;
        ctx: {
            [key: string | number | symbol]: unknown;
            toSource: true;
            asOverride?: never;
            wasReset?: never;
        };
    }): void;
    /**
     * A change was made to the override value
     */
    (e: {
        value: T | undefined;
        oldValue: T | undefined;
        ctx: {
            [key: string | number | symbol]: unknown;
            toSource: never;
            asOverride: true;
            wasReset?: never;
        };
    }): void;
    /**
     * The override value was changed due to a reset.
     */
    (e: {
        value: T | undefined;
        oldValue: T | undefined;
        ctx: {
            [key: string | number | symbol]: unknown;
            toSource: never;
            wasReset: true;
            asOverride: true;
        };
    }): void;
}>;
/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 */
export declare function hook<T>(value: Hook<T>): Hook<T>;
/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 */
export declare function hook<T>(value: T): Hook<T>;
/**
 * Creates a new hook with an empty value that can be used to reference a value here and elsewhere.
 */
export declare function hook<T>(): Hook<T>;
declare namespace Hook {
    /** @alias {@link HookEvent} */
    type Event<T> = HookEvent<T>;
    /** @alias {@link HookEventContext} */
    type EventContext<T> = HookEventContext<T>;
    /** @alias {@link HookListener} */
    type Listener<T> = HookListener<T>;
}
export { Hook };
export default Hook;
