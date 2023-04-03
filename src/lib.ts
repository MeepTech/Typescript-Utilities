//#region TS

// ts type helpers
export {
  Class,
  Constructor,
  Constructable,
  SpreadConstructable,
  HybridConstructable,
} from "./types/ctor";
export {
  First,
  Last,
  Require,
  MapTuple,
  Protect
} from "./types/mod";
export {
  IsUnion
} from "./types/is";
export {
  RequireAtLeastOne,
  RequireOnlyOne
} from "./types/or";

//#endregion

//#region JS

// comparisons
export {
  hasStaticIs,
} from "./comparison/is";
export {
  default as If,
  isObject,
  isSymbol,
  isIterable,
  isNonStringIterable,
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isArray,
  isEmptyObject,
} from "./comparison/guards";

// decorators
export { enumerable, skipped } from "./decorators/enum";
export { implementsStatic } from "./decorators/static";
export { lazy } from "./decorators/lazy";

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
} from "./helpers/loop";

// wrappers
// - wrap
export {
  default as Wrap,
  wrap,
  $WRAP,
} from "./wrappers/wrap";

// - wards
export {
  default as Ward,
  ward,
  $WARD
} from "./wrappers/ward";

// - mod
export {
  default as Mod,
  mod,
  $MOD
} from "./wrappers/mod";

// - hook
export {
  default as Hook,
  hook,
  $HOOK
} from "./wrappers/hook";

//#endregion