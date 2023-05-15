/**
 * Get the first element of a tuple.
 */
export type FirstOf<T extends any[]> = T extends [infer F, ...any[]] ? F : never;
/**
 * Get the last element of a tuple.
 */
export type LastOf<T extends any[]> = T extends [...any[], infer L] ? L : never;
/**
 * Get the first element of a tuple.
 */
export type TrimFirstOf<T extends any[]> = T extends [first: any, ...rest: infer R] ? R : never;
/**
 * Get the last element of a tuple.
 */
export type TrimLastOf<T extends any[]> = T extends [...rest: infer R, last: any] ? R : never;
/**
 * Map a tuple to an object with the keys of the tuple as the keys of the object.
 */
export type ObjectFrom<Tuple extends Array<{
    key: string;
}>> = {
    [key in Tuple[number]['key']]: Extract<Tuple[number], {
        key: key;
    }>;
};
/**
 * Set the given properties of an object to be required.
 */
export type Require<T, K extends keyof T> = T & Required<Pick<T, K>>;
/**
 * Set the given properties of an object to be readonly ('protected')
 */
export type Protect<T, K extends keyof T> = T & Readonly<Pick<T, K>>;
/**
 * Used to make a read-only type writeable.
 */
export type Writeable<T extends {
    [x: string]: any;
}, K extends string> = {
    [P in K]: T[P];
};
