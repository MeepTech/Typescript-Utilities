/**
 * Require a class to implement the given type in a static manner.
 *
 * @decorator class
 */
export declare function implementsStatic<TStaticRequirements>(): <TClass extends TStaticRequirements>(cls: TClass, _: any) => void;
