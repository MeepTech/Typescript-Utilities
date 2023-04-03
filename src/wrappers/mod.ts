/// can be used to add newprops to an object.

export const $MOD
  = Symbol('$MOD');

//#region constructor

/**
 * Interface for the constructor of the Mod class.
 */
interface ModConstructor {
  readonly SYMBOL: typeof $MOD;

  new <T extends object, TMod extends {
    [key: symbol | string | number]: any;
  }>(value: T, newprops: TMod): Mod<T, TMod>;
}

/**
 * Add newprops to an existing object.
 */
function ModConstructor<
  T extends object,
  TMod extends {
    [key: symbol | string | number]: any;
  }>(
    this: Mod<T, TMod>,
    original: T,
    newprops: TMod,
  ) {
  return Object.assign(
    original,
    newprops,
    {
      [$MOD]: newprops,
    }
  ) as Mod<T, TMod>;
}

const Mod: ModConstructor
  = ModConstructor as unknown as ModConstructor;

/** @ts-expect-error: first set to readonly */
Mod.SYMBOL
  = $MOD;

//#region

//#region instances

/**
 * Used to add newprops to an existing object.
 */
type Mod<T, TMod extends {
  [key: symbol | string | number]: any;
}>
  = T
  & TMod
  & {
    [$MOD]: TMod & {
      hasNewProps: true;
    }
  };

//#endregion

//#region functional builder

/**
 * Used to add newprops to an existing object.
 */
export function mod<
  T extends object,
  TMod extends {
    [key: symbol | string | number]: any;
  }
>(
  value: T,
  newprops: TMod = {} as TMod,
): Mod<T, TMod> {
  return new Mod(value, newprops);
}

//#endregion 

export { Mod as Box };
export default Mod;