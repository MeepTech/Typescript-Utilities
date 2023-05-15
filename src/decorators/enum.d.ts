/**
 * Decorator that sets the enumerable property of a class field.
 *
 * @decorator
 */
export declare function enumerable(value: boolean): (target: any, propertyKey: string) => void;
/**
 * Decorator that sets the enumerable property of a class field to false.
 * > This will cause it to be 'skipped' in Object.keys() and for...in loops on non-terable objects.
 *
 * @decorator
 */
export declare const skipped: (target: any, propertyKey: string) => void;
