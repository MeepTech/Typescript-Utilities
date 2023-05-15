import { ObjectFrom, FirstOf, LastOf } from './mod';
require('../helpers/static');

/**
 * A class type that can be constructed. (non-abstract)
 */
export type Constructor<T> = {
  new(...args: any[]): T;
  prototype: T;
};

/**
 * A class type of any kind (including abstract class).
 */
export type Class<T> = (abstract new (
  ...args: any[]
) => T) & { prototype: T };

/**
 * A type or the arugments used to construct the type.
 */
export type Constructable<
  TCtor extends Constructor<T>,
  T = InstanceType<TCtor>
> =
  | InstanceType<TCtor>
  | ObjectFrom<ConstructorParameters<TCtor>>;

/**
 * A type or the spread object based arugments used to construct the type.
 */
export type SpreadConstructable<
  TCtor extends Constructor<T>,
  T = InstanceType<TCtor>
> =
  | InstanceType<TCtor>
  | FirstOf<ConstructorParameters<TCtor>>;

/**
 * A type or the arugments used to construct the type.
 * This also grabs the last object type in the constructor parameters and spreads it into the type as a set of arguments.
 */
export type HybridConstructable<
  TCtor extends Constructor<T>,
  T = InstanceType<TCtor>
> =
  | InstanceType<TCtor>
  | Extract<
    LastOf<ConstructorParameters<TCtor>>,
    { [key: string | number | symbol]: any }
  >
  | ObjectFrom<ConstructorParameters<TCtor>>;
