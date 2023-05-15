/**
 * A type guard is a function that checks if a value is of a specific type.
 */
export type TypeGuard<T> = (value: unknown) => value is T;
/**
 * Check if a type is a union type.
 */
export type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false ? false : true;
