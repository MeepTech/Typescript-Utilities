/**
 * Used to make a getter lazy load and cache it's contents.
 *
 * @decorator getter
 *
 * @example <caption> The following will only be initialized once, and the result is cached as the return value of the getter. This means the constructor is only called once, even if the getter is called multiple times.</caption>
 * // (NOTE: the:{@}, is an escape for the jsdoc comment and should be replaced with a lone:@.)
 * #|  class Foo {
 * #|   {@}lazy
 * #|   get bar(): Bar {
 * #|     return new Bar();
 * #|   }
 * #|  }
 */
export declare const lazy: (target: any, _: any) => any;
