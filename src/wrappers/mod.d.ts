export declare const $MOD: unique symbol;
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
declare function ModConstructor<T extends object, TMod extends {
    [key: symbol | string | number]: any;
}>(this: Mod<T, TMod>, original: T, newprops: TMod): Mod<T, TMod>;
declare const Mod: ModConstructor;
/**
 * Used to add newprops to an existing object.
 */
type Mod<T, TMod extends {
    [key: symbol | string | number]: any;
}> = T & TMod & {
    [$MOD]: TMod & {
        hasNewProps: true;
    };
};
/**
 * Used to add newprops to an existing object.
 */
export declare function mod<T extends object, TMod extends {
    [key: symbol | string | number]: any;
}>(value: T, newprops?: TMod): Mod<T, TMod>;
export { Mod as Box };
export default Mod;
