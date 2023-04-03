/**
 * Decorator that sets the enumerable property of a class field.
 *
 * @decorator
 */
export function enumerable(value: boolean) {
  return function (target: any, propertyKey: string) {
    let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    if (descriptor.enumerable != value) {
      descriptor.enumerable = value;
      descriptor.writable = true;
      Object.defineProperty(target, propertyKey, descriptor)
    }
  };
}

/**
 * Decorator that sets the enumerable property of a class field to false.
 * > This will cause it to be 'skipped' in Object.keys() and for...in loops on non-terable objects.
 *
 * @decorator
 */
export const skipped
  = enumerable(false);

/* TODO: remove once we verify the other one works
const _enumerable: {
  (target: any, name: string): void;
  (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
} = (target: any, name: string, desc?: any) => {
  if (desc) {
    desc.enumerable = true;
    return desc;
  }
  Object.defineProperty(target, name, {
    set(value) {
      Object.defineProperty(this, name, {
        value, enumerable: true, writable: true, configurable: true,
      });
    },
    enumerable: true,
    configurable: true,
  });
};

const nonenumerable: {
  (target: any, name: string): void;
  (target: any, name: string, desc: PropertyDescriptor): PropertyDescriptor;
} = (target: any, name: string, desc?: any) => {
  if (desc) {
    desc.enumerable = false;
    return desc;
  }
  Object.defineProperty(target, name, {
    set(value) {
      Object.defineProperty(this, name, {
        value, writable: true, configurable: true,
      });
    },
    configurable: true,
  });
};*/