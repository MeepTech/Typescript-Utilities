import { wrap } from "./wrap";
import { lazy } from '../decorators/lazy';

/**
 * A key that can be used to try to acces the hook trait of a value.
 * // TODO: add to global keys section
 */
export const $HOOK
  = Symbol("$HOOK");

//#region constructor

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

//#region implementation

/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 * The hook can also be used to listen for changes to the value.
 */
function HookConstructor<T>(
  this: Hook<T>,
  value: T
): Hook<T> {
  return hook<T>(
    value
  );
}

HookConstructor.SYMBOL
  = $HOOK;

HookConstructor.is
  ??= isHook as any;

const Hook: HookConstructor
  = HookConstructor as unknown as HookConstructor;

//#endregion

//#endregion

//#region instance

/**
 * A value that can be referenced by other hooks and listened to for changes.
 */
type Hook<T>
  = T
  & {
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
      set(value: T, ctx?: { [key: string | number | symbol]: any }): void;

      /**
       * Same as `.override =` but you can pass in context as well.
       * 
       * @alias {@link override}
       */
      set(value: T, ctx: {
        [key: string | number | symbol]: unknown
        override: true
      }): void;

      /**
       * Reset the hook to mirror it's parent.
       * (clears the override value).
       */
      resync(): void;
    }
  }

/**
 * Check if a value is a hook.
 */
export function isHook<T>(
  value: T
): value is Hook<T> {
  return value?.hasOwnProperty($HOOK) ?? false;
}

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

//#region sub-types

/**
 * Details for an onChange event for a hook value.
 */
export type HookEvent<T> = {
  value: T | undefined,
  oldValue: T | undefined,
  ctx?: HookEventContext<T>
}

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
    value: T | undefined,
    oldValue: T | undefined,
    ctx: {
      [key: string | number | symbol]: unknown,
      toSource: true,
      asOverride?: never,
      wasReset?: never
    }
  }): void

  /**
   * A change was made to the override value
   */
  (e: {
    value: T | undefined,
    oldValue: T | undefined,
    ctx: {
      [key: string | number | symbol]: unknown,
      toSource: never,
      asOverride: true,
      wasReset?: never
    }
  }): void

  /**
   * The override value was changed due to a reset.
   */
  (e: {
    value: T | undefined,
    oldValue: T | undefined,
    ctx: {
      [key: string | number | symbol]: unknown
      toSource: never,
      wasReset: true,
      asOverride: true
    }
  }): void
}>

//#endregion

//#endregion

//#region functional builder

/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 */
export function hook<T>(
  value: Hook<T>
): Hook<T>

/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 */
export function hook<T>(
  value: T
): Hook<T>

/**
 * Creates a new hook with an empty value that can be used to reference a value here and elsewhere.
 */
export function hook<T>(): Hook<T>

/**
 * Creates a new hook that can be used to reference a value here and elsewhere.
 */
export function hook<T>(
  value?: T
): Hook<T> {
  const props: Hook<T>[typeof $HOOK]
    = new HookProps(value) as unknown as Hook<T>[typeof $HOOK];

  return wrap(value, {
    [$HOOK]: props
  });
}

/**
 * Helper class for hook properties.
 */
class HookProps<T> {
  #hasOverride: boolean = false;
  #override: T | undefined = undefined;
  #source: Hook<T> | undefined = undefined;
  #listeners: HookListener<T>[] = [];

  get value(): T {
    return this.#hasOverride
      ? this.#override!
      : this.#source?.[$HOOK].value!;
  }

  set value(value: T) {
    this.#source?.[$HOOK].set(value, {
      toSource: true
    });
  }

  get hasOverride(): boolean {
    return this.#hasOverride;
  }

  get override(): T | undefined {
    return this.#override;
  }

  set override(value: T | undefined) {
    if (value === this.#override) return;

    const oldValue = this.#override;
    this.#override = value;
    this.#hasOverride = value !== undefined;

    this.onChange({
      value: this.#override!,
      oldValue,
      ctx: {
        asOverride: true
      }
    });
  }

  get source(): Hook<T> | undefined {
    return this.#source;
  }

  set source(source: Hook<T> | undefined) {
    if (source === this.#source) return;

    const oldSource = this.#source;
    this.#source = source;

    this.onChange({
      value: this.#override!,
      oldValue: this.#override,
      ctx: {
        newSource: this.#source,
        oldSource,
        asOverride: true
      }
    });
  }

  get hasSource(): boolean {
    return this.#source !== undefined;
  }

  @lazy
  get onChange(): OnHookChanged<T> {
    const func = this.#onChange as OnHookChanged<T>;

    /** @ts-expect-error: first time setting a readonly property */
    func.add = this.#addListener;

    return func;
  }

  constructor(value: Hook<T> | T | undefined) {
    if (isHook(value)) {
      this.#hasOverride = false;
      this.#source = value as Hook<T>;
    } else if (arguments.length !== 0) {
      this.#hasOverride = true;
      this.#override = value;
    }
  }

  set(value: T, ctx?: HookEventContext<T>): void {
    if ((ctx?.toSource ?? true) && this.#source) {
      this.#source[$HOOK].set(value, ctx);
    } else if ((ctx?.asOverride ?? false) && this.#override !== value) {
      this.#override = value;
      this.#hasOverride = true;
      this.onChange({
        value,
        oldValue: undefined,
        ctx: {
          toSource: true,
          ...ctx
        }
      });
    }
  }

  resync() {
    if (this.#override) {
      const oldValue = this.#override;
      this.#override = undefined;

      this.onChange({
        value: undefined,
        oldValue,
        ctx: {
          asOverride: true,
          wasReset: true
        }
      });
    }
  }

  #onChange(e: HookEvent<T>) {
    this.#listeners.forEach(l => l(e));
  }

  #addListener(listener: HookListener<T>) {
    this.#listeners.push(listener);
  }
}

//#endregion

// static types 
namespace Hook {
  /** @alias {@link HookEvent} */
  export type Event<T> = HookEvent<T>;

  /** @alias {@link HookEventContext} */
  export type EventContext<T> = HookEventContext<T>;

  /** @alias {@link HookListener} */
  export type Listener<T> = HookListener<T>;
}

export { Hook };
export default Hook;