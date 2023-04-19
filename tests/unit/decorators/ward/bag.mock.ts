// TODO: most of these should be imported from 'lib.ts'
import {
  $WARD,
  WardConfigOf,
  implementsWardConfig,
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
  };
}

@implementsWardConfig
class Bag_withDefaults
  extends Bag
  implements Bag_withDefaults
{
  static readonly [$WARD] = {
    DEFAULT_PROTECTED_KEYS: ['contents'] as const,
  };

  constructor(contents: string) {
    super(contents);
  }
}

export { Bag_withDefaults };

interface Bag_withDefaultChildWards {
  constructor: Function & {
    readonly [$WARD]: typeof Bag_withDefaultChildWards[typeof $WARD];
  };
}

@implementsWardConfig
class Bag_withDefaultChildWards
  extends Bag
  implements Bag_withDefaultChildWards
{
  static readonly [$WARD] = {
    DEFAULT_PROTECTED_KEYS: ['contents'] as const,
    DEFAULT_CHILD_WARDS: {
      bag: Bag_withDefaults[$WARD],
    },
  } as const;

  bag: Bag = new Bag_withDefaults('child');

  constructor(contents: string) {
    super(contents);
  }
}

export { Bag_withDefaultChildWards };

//#endregion

//#region type tests
// TODO: get a 'real' type-testing library?
// Setup

type Bag_withDefaultsConfig =
  typeof Bag_withDefaults[typeof $WARD];

type WardConfigOfBag_withDefaults =
  WardConfigOf<Bag_withDefaults>;

type Bag_withDefaultChildWardsConfig =
  typeof Bag_withDefaultChildWards[typeof $WARD];

type WardConfigOfBag_withDefaultChildWards =
  WardConfigOf<Bag_withDefaultChildWards>;

// Tests
// protected keys tests
// - This shouldn't be undefined:
const _testType_Config_Is_Not_Undefined: WardConfigOfBag_withDefaults extends undefined
  ? never
  : WardConfigOfBag_withDefaults =
  Bag_withDefaults[$WARD];

// - These three should all be the same:
const _testType_Config_Is_Bag_withDefaultsConfig: Bag_withDefaultsConfig =
  Bag_withDefaults[$WARD];
const _testType_Config_Is_WardConfigOf_Bag_withDefaults: WardConfigOf<Bag_withDefaults> =
  Bag_withDefaults[$WARD];
const _testType_Config_Is_WardConfigOfBag_withDefaults: WardConfigOfBag_withDefaults =
  Bag_withDefaults[$WARD];

const _testType_Config_Is_All_Three: Bag_withDefaultsConfig &
  WardConfigOf<Bag_withDefaults> &
  WardConfigOfBag_withDefaults =
  Bag_withDefaults[$WARD];

// children tests
// - This shouldn't be undefined:
const _testType_Config_Is_Not_Undefined_withDefaultChildWards: WardConfigOfBag_withDefaultChildWards extends undefined
  ? never
  : WardConfigOfBag_withDefaultChildWards =
  Bag_withDefaultChildWards[$WARD];

const _testType_Config_Is_Bag_withDefaultChildWardsConfig: Bag_withDefaultChildWardsConfig =
  Bag_withDefaultChildWards[$WARD];

const _testType_Config_Is_WardConfigOf_Bag_withDefaultChildWards: WardConfigOf<Bag_withDefaultChildWards> =
  Bag_withDefaultChildWards[$WARD];

const _testType_Config_Is_WardConfigOfBag_withDefaultChildWards: WardConfigOfBag_withDefaultChildWards =
  Bag_withDefaultChildWards[$WARD];

const _testType_Config_Is_All_Three_withDefaultChildWards: Bag_withDefaultChildWardsConfig &
  WardConfigOf<Bag_withDefaultChildWards> &
  WardConfigOfBag_withDefaultChildWards =
  Bag_withDefaultChildWards[$WARD];

const _test_Child_Ward_Config_Is_In_Bag_withDefaultChildWardsConfig: Bag_withDefaultsConfig =
  Bag_withDefaultChildWards[$WARD].DEFAULT_CHILD_WARDS
    .bag;

//#endregion
