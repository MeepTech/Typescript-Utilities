import { hasProp, isPlainObject } from './comparison/guards';
//#region TS

// ts type helpers
export type {
  Class,
  Constructor,
  Constructable,
  SpreadConstructable,
  HybridConstructable,
} from './types/ctor';
export type {
  FirstOf,
  LastOf,
  Require,
  ObjectFrom,
  Protect,
} from './types/mod';
export type {
  IsUnion
} from './types/is';
export type {
  RequireAtLeastOne,
  RequireOnlyOne,
} from './types/or';

//#endregion

//#region JS

// comparisons
export {
  default as Check,
  default as If,
  isObject,
  isSymbol,
  isIterable,
  isNonStringIterable,
  isPlainObject,
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isArray,
  isEmptyObject,
  isRecord,
  hasProp
} from './comparison/guards';

// decorators
export {
  enumerable,
  skipped,
} from './decorators/enum';
export { lazy } from './decorators/lazy';

// iterable/loop helpers
export {
  default as Loop,
  count,
  forEach,
  forIn,
  map,
  through,
  each,
  some,
  first,
} from './helpers/loop';

// wrappers
// - wrap
export {
  default as Wrap,
  wrap,
  $WRAP,
} from './wrappers/wrap';

// - ward
export {
  default as Ward,
  ward,
  $WARD,
  implementsWardConfig,
  isWard,
  isWarded,
  isNotWarded,
} from './wrappers/ward';

// - mod
export {
  default as Mod,
  mod,
  $MOD,
} from './wrappers/mod';

// - hook
export {
  default as Hook,
  hook,
  $HOOK,
  isHook,
} from './wrappers/hook';

// - bevel
export {
  default as Bevel,
  bevel,
  $BEVEL,
  isBevel,
} from './wrappers/bevel';

//#endregion
