/**
 * Require a class to implement the given type in a static manner.
 * 
 * @decorator class
 */
export function implementsStatic<TStaticRequirements>() {
  // Extend the constructor with the given type
  return <TClass extends TStaticRequirements>(
    cls: TClass,
    _: any
    // make the extended constructor a requirement of the class itself:
  ) => { cls };
}