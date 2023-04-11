/**
 * The bevel trait key
 */
export const $BEVEL = Symbol('$BEVEL');

/**
 * Utility type for defining the fields of a bevel object
 */
type BevelFields = { [key in string]?: unknown };

/**
 * A readonly collection of data that works like both an array and an object.
 */
type Bevel<TData extends BevelFields, TFacets extends BevelFields = {}>
  = { readonly [key in keyof TData]: TData[key] }
  & { readonly [index in keyof ObjectValueTuple<TData>]: ObjectValueTuple<TData>[index] }
  & { readonly [key in keyof TFacets]: TFacets[key] }
  & ObjectValueTuple<TData>
  & {
    get [$BEVEL](): BevelMetadata<TData, TFacets>,
  };

/**
 * A getter collection for metadata of a bevel.
 */
type BevelMetadata<
  TData extends BevelFields,
  TFacets extends BevelFields = {}
> = {
  object: ({ readonly [key in keyof TData]: TData[key] }
    & { readonly [key in keyof TFacets]: TFacets[key] }),

  data: { readonly [key in keyof TData]: TData[key] },
  enumerables: { readonly [key in keyof TData]: TData[key] },

  facets: { readonly [key in keyof TFacets]: TFacets[key] },
  skipped: { readonly [key in keyof TFacets]: TFacets[key] },

  array: ObjectValueTuple<TData>,
  iterable: ObjectValueTuple<TData>,

  iterator: ObjectValueTuple<TData>[typeof Symbol.iterator],

  keys: ({ readonly [key in keyof TData]: key }
    & { readonly [key in keyof TFacets]: key }),

  facetKeys: { readonly [key in keyof TFacets]: key },
  skippedKeys: { readonly [key in keyof TFacets]: key },

  enumerableKeys: { readonly [key in keyof TData]: key },
  dataKeys: { readonly [key in keyof TData]: key },
};

/**
 * Turn an object into a constant version of itself that can be iterated over and deconstructed as an array.
 * It's like an array combined with an object.
 */
function bevel<
  TData extends BevelFields,
>(
  data: TData
): Bevel<TData, {}>;

/**
 * Turn an object into a constant version of itself that can be iterated over and deconstructed as an array.
 * It's like an array combined with an object.
 * 
 * @param facets Sub-bevel groups to be added to the object keys but not the array indexes.
 */
function bevel<
  TData extends BevelFields,
  TFacets extends BevelFields
>(
  data: TData,
  facets: TFacets
): Bevel<TData, TFacets>;

function bevel<
  TData extends BevelFields,
  TFacets extends BevelFields
>(
  data: TData,
  facets?: TFacets
): Bevel<TData, TFacets> {

  const packed = Object.values(data) as {
    readonly [index in number]: ObjectValueTuple<TData>[index]
  };

  Object.assign(packed, data, facets);

  return packed as (
    { readonly [key in keyof TData]: TData[key] }
    & ObjectValueTuple<TData>
    & (Readonly<TFacets> | any)
  );
}

bevel.SYMBOL
  = $BEVEL;

bevel.is
  = isBevel;

export { bevel };
const Bevel = bevel;
export default Bevel;

/**
 * Check if a value is a bevel object.
 * // TODO: add specific type guards for the generics
 */
export function isBevel(value: unknown): value is Bevel<any, any> {
  return typeof value === 'object' && value !== null && $BEVEL in value;
}

type ObjectValueTuple<T, KS extends any[] = TuplifyUnion<keyof T>, R extends any[] = []> =
  KS extends [infer K, ...infer KT]
  ? ObjectValueTuple<T, KT, [...R, T[K & keyof T]]>
  : R

type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

type Push<T extends any[], V> = [...T, V];

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never