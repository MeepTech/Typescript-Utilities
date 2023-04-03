
/**
 * Get the first element of a tuple.
 */
export type First<T extends any[]>
  = T extends [infer F, ...any[]]
  ? F
  : never;

/**
 * Get the last element of a tuple.
 */
export type Last<T extends any[]>
  = T extends [...any[], infer L]
  ? L
  : never;

/**
 * Map a tuple to an object with the keys of the tuple as the keys of the object.
 */
export type MapTuple<Tuple extends Array<{ key: string }>> = {
  [key in Tuple[number]['key']]: Extract<Tuple[number], { key: key }>
}

/**
 * Set the given properties of an object to be required.
 */
export type Require<T, K extends keyof T>
  = T & Required<Pick<T, K>>;

/**
 * Set the given properties of an object to be readonly ('protected')
 */
export type Protect<T, K extends keyof T>
  = T & Readonly<Pick<T, K>>;