import { isPlainObject } from '../../../../src/lib';

test('{} => true', () => {
  const value = {};
  const result = isPlainObject(value);
  // @ts-jest: type-checking assignment.
  var _: {} = value;

  // @ts-jest: make sure the type is not never
  // @ts-expect-error
  var _: never = value;

  expect(isPlainObject({}))
    .toStrictEqual(true);
});

test('{test: "test"} => true', () =>
  expect(isPlainObject({ test: 'test' }))
    .toStrictEqual(true));

test('new Date() => false', () =>
  expect(isPlainObject(new Date()))
    .toStrictEqual(false));

test('new Object() => true', () =>
  expect(isPlainObject(new Object()))
    .toStrictEqual(true));

test('[] => false', () =>
  expect(isPlainObject([]))
    .toStrictEqual(false));

test('null => false', () =>
  expect(isPlainObject(null))
    .toStrictEqual(false));

test('undefined => false', () =>
  expect(isPlainObject(undefined))
    .toStrictEqual(false));

test('Object.create({test: "test"}) => true', () =>
  expect(isPlainObject(Object.create({ test: 'test' })))
    .toStrictEqual(true));

test('Symbol() => false', () =>
  expect(isPlainObject(Symbol()))
    .toStrictEqual(false));