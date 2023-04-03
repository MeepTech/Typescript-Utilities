
/**
 * Require at least one of the given properties in T.
 */
export type RequireAtLeastOne<
  T,
  Keys extends keyof T = keyof T
> =
  Pick<T, Exclude<keyof T, Keys>>
  & { [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

/**
 * Require only and exactly one of the given properties in T.
 */
export type RequireOnlyOne<
  T,
  Keys extends keyof T = keyof T
> =
  Pick<T, Exclude<keyof T, Keys>>
  & { [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]