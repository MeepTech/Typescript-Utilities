import {
  isSymbol,
  isObject,
  isString,
  isBoolean,
  isNumber,
} from '../comparison/guards';
/// can be used to add wrap data around an object.

export const $WRAP = Symbol('$WRAP');

//#region constructor

/**
 * Interface for the constructor of the Wrap class.
 */
interface WrapConstructor {
  new <
    T,
    TExtraData extends {
      [key: symbol | string | number]: any;
    }
  >(
    value: T,
    wrapdata: TExtraData,
    proxy?: T extends NonNullable<T>
      ? ProxyHandler<T>
      : // TODO: special proxy handler for primitives:
        {}
  ): Wrap<T, TExtraData>;
}

function WrapConstructor<
  T,
  TExtraData extends {
    [key: symbol | string | number]: any;
  }
>(
  this: Wrap<T, TExtraData>,
  original: T,
  wrapdata: TExtraData,
  proxyHandler?: T extends NonNullable<T>
    ? ProxyHandler<T>
    : // TODO: special proxy handler for primitives:
      ProxyHandler<
        T extends string
          ? String
          : T extends number
          ? Number | T extends symbol
            ? Symbol | T extends boolean
              ? Boolean | T extends null
                ? never | T extends undefined
                  ? never
                  : never
                : never
              : never
            : never
          : never
      >
) {
  let base: object;

  // wrapping objects is easy:
  if (isObject(original)) {
    base = original;
  } // special wrapper for primitives:
  else {
    // - string
    if (isString(original)) {
      base = new String(original);
    }
    // - number
    else if (isNumber(original)) {
      base = new Number(original);
    }
    // - boolean
    else if (isBoolean(original)) {
      base = new Boolean(original);
    }
    // - symbol
    else if (isSymbol(original)) {
      base = original as Symbol;
    }

    // TODO: special wrapper for null/undefined determined by an option/the default/or a special method?:
    // - null
    // - undefined

    // - unknown
    else {
      throw new Error('Wrap: Unsupported type.');
    }
  }

  // wrap the object:
  return Object.assign(
    new Proxy(
      base,
      (proxyHandler ?? {}) as ProxyHandler<object>
    ),
    wrapdata,
    {
      [$WRAP]: wrapdata,
    }
  ) as Wrap<T, TExtraData>;
}

const Wrap: WrapConstructor =
  WrapConstructor as unknown as WrapConstructor;

//#region

//#region instances

/**
 * Used to wrap an object with wrapdata.
 */
type Wrap<
  T,
  TWrap extends {
    [key: symbol | string | number]: any;
  }
> = T &
  TWrap & {
    [$WRAP]: TWrap & {
      isWrapped: true;
    };
  };

//#endregion

//#region functional builder

function wrap<
  T,
  TExtraData extends {
    [key: symbol | string | number]: any;
  }
>(
  original: T,
  wrapdata: TExtraData,
  proxyHandler?: T extends NonNullable<T>
    ? ProxyHandler<T>
    : // TODO: special proxy handler for primitives:
      ProxyHandler<
        T extends string
          ? String
          : T extends number
          ? Number | T extends symbol
            ? Symbol | T extends boolean
              ? Boolean | T extends null
                ? never | T extends undefined
                  ? never
                  : never
                : never
              : never
            : never
          : never
      >
): Wrap<T, TExtraData> {
  let base: object;

  // wrapping objects is easy:
  if (isObject(original)) {
    base = original;
  } // special wrapper for primitives:
  else {
    // - string
    if (isString(original)) {
      base = new String(original);
    }
    // - number
    else if (isNumber(original)) {
      base = new Number(original);
    }
    // - boolean
    else if (isBoolean(original)) {
      base = new Boolean(original);
    }
    // - symbol
    else if (isSymbol(original)) {
      base = original as Symbol;
    }

    // TODO: special wrapper for null/undefined determined by an option/the default/or a special method?:
    // - null
    // - undefined

    // - unknown
    else {
      throw new Error('Wrap: Unsupported type.');
    }
  }

  // wrap the object:
  return Object.assign(
    new Proxy(
      base,
      (proxyHandler ?? {}) as ProxyHandler<object>
    ),
    wrapdata,
    {
      [$WRAP]: wrapdata,
    }
  ) as Wrap<T, TExtraData>;
}

export { wrap };

//#endregion

export { Wrap };
export default Wrap;
