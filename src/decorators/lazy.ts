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
export const lazy
  = function asLazy(target: any, _: any): any {
    const cache = new WeakMap<any, any>();

    return function getLazily(this: any) {
      if (!cache.has(this)) {
        cache.set(this, target.call(this));
      }

      return cache.get(this);
    }
  };