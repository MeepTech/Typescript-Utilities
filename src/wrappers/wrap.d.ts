export declare const $WRAP: unique symbol;
/**
 * Interface for the constructor of the Wrap class.
 */
interface WrapConstructor {
    new <T, TExtraData extends {
        [key: symbol | string | number]: any;
    }>(value: T, wrapdata: TExtraData, proxy?: T extends NonNullable<T> ? ProxyHandler<T> : {}): Wrap<T, TExtraData>;
}
declare function WrapConstructor<T, TExtraData extends {
    [key: symbol | string | number]: any;
}>(this: Wrap<T, TExtraData>, original: T, wrapdata: TExtraData, proxyHandler?: T extends NonNullable<T> ? ProxyHandler<T> : ProxyHandler<T extends string ? String : T extends number ? Number | T extends symbol ? Symbol | T extends boolean ? Boolean | T extends null ? never | T extends undefined ? never : never : never : never : never : never>): Wrap<T, TExtraData>;
declare const Wrap: WrapConstructor;
/**
 * Used to wrap an object with wrapdata.
 */
type Wrap<T, TWrap extends {
    [key: symbol | string | number]: any;
}> = T & TWrap & {
    [$WRAP]: TWrap & {
        isWrapped: true;
    };
};
declare function wrap<T, TExtraData extends {
    [key: symbol | string | number]: any;
}>(original: T, wrapdata: TExtraData, proxyHandler?: T extends NonNullable<T> ? ProxyHandler<T> : ProxyHandler<T extends string ? String : T extends number ? Number | T extends symbol ? Symbol | T extends boolean ? Boolean | T extends null ? never | T extends undefined ? never : never : never : never : never : never>): Wrap<T, TExtraData>;
export { wrap };
export { Wrap };
export default Wrap;
