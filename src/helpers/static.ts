//#region globals

Object.defineProperty(Object.prototype, 'static', {
  value: function (): any {
    return this.constructor;
  },
  enumerable: false,
  configurable: false
});

declare global {
  interface Object {

    /**
     * Helper to get the class of an object.
     * 
     * @param this 
     */
    static<T extends NewableFunction & Class<T>>(this: InstanceType<T>): T;
  }
}

//#endregion

import { Class } from "../types/ctor";
