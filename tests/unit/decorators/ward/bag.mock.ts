// TODO: most of these should be imported from 'lib.ts'
import {
  $WARD,
  WardConfigOf,
  implementsWardConfig,
  WardConfig,
  Alter
} from '../../../../src/wrappers/ward';

//#region mocks

export class Bag {
  contents: string = null!;

  constructor(contents: string) {
    this.contents = contents;
  }
}

interface Bag_withDefaults {
  constructor: Function & {
    readonly [$WARD]: typeof Bag_withDefaults[typeof $WARD];
  }
}

@implementsWardConfig
class Bag_withDefaults extends Bag implements Bag_withDefaults {
  static readonly [$WARD] = {
    DEFAULT_PROTECTED_KEYS: ["contents"] as const
  }

  constructor(contents: string) {
    super(contents);
  }
}

export { Bag_withDefaults };


interface Bag_withDefaultAlterations {
  constructor: Function & {
    readonly [$WARD]: typeof Bag_withDefaultAlterations[typeof $WARD];
  }
}

@implementsWardConfig
class Bag_withDefaultAlterations extends Bag implements Bag_withDefaultAlterations {
  static readonly [$WARD] = {
    DEFAULT_PROTECTED_KEYS: ["contents"] as const,
    DEFAULT_ALTERATIONS: {
      contents:
      {
        key: "contents",
        get: (thisArg: Bag_withDefaultAlterations) => {
          return parseInt(thisArg["contents"]);
        }
      }
    }
  } as const;

  constructor(contents: string) {
    super(contents);
  }
}

export { Bag_withDefaultAlterations };

//#endregion

//#region type tests
// TODO: get a real type-testing library?
// Setup

type Bag_withDefaultsConfig
  = typeof Bag_withDefaults[typeof $WARD];

type WardConfigOfBag_withDefaults
  = WardConfigOf<Bag_withDefaults>;

// Tests
// - This shouldn't be undefined:
const _testType_Config_Is_Not_Undefined
  : (WardConfigOfBag_withDefaults extends undefined
    ? never
    : WardConfigOfBag_withDefaults)
  = Bag_withDefaults[$WARD];

// - These three should all be the same:
const _testType_Config_Is_Bag_withDefaultsConfig: Bag_withDefaultsConfig
  = Bag_withDefaults[$WARD];
const _testType_Config_Is_WardConfigOf_Bag_withDefaults: WardConfigOf<Bag_withDefaults>
  = Bag_withDefaults[$WARD];
const _testType_Config_Is_WardConfigOfBag_withDefaults: WardConfigOfBag_withDefaults
  = Bag_withDefaults[$WARD];

const _testType_Config_Is_All_Three: (Bag_withDefaultsConfig & WardConfigOf<Bag_withDefaults> & WardConfigOfBag_withDefaults)
  = Bag_withDefaults[$WARD];

//#endregion

