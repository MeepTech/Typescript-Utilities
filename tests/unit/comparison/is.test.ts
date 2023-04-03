import {
  describe,
  test,
  expect
} from '@jest/globals';

require('../../../src/global');

describe('Object.prototype.is', () => {

  describe('primitives', () => {

    describe('string', () => {

      describe('is', () => {

        test('string literal', () =>
          expect(''.is(String))
            .toBe(true));

        test('String via literal', () =>
          expect(new String('').is(String))
            .toBe(true));

        test('string template literal', () =>
          expect(`${'x'}`.is(String))
            .toBe(true));
      });

      describe('not', () => {

        test('number literal', () =>
          expect(0.0.is(String))
            .toBe(false));

        test('Number via literal', () =>
          expect(new Number(0.0).is(String))
            .toBe(false));

        test('boolean literal', () =>
          expect(true.is(String))
            .toBe(false));

        test('Boolean via literal', () =>
          expect(new Boolean(true).is(String))
            .toBe(false));

        test('symbol', () =>
          expect(Symbol('x').is(String))
            .toBe(false));

        test('array', () =>
          expect([].is(String))
            .toBe(false));

        test('function', () =>
          expect((() => { }).is(String))
            .toBe(false));

        test('object', () =>
          expect({}.is(String))
            .toBe(false));

        test('null', () =>
          expect((null as any)?.is(String))
            .toBe(undefined));

        test('undefined', () =>
          expect((undefined as any)?.is(String))
            .toBe(undefined));

        test('NaN', () =>
          expect(NaN.is(String))
            .toBe(false));

        test('custom class', () =>
          expect((class { }).is(String))
            .toBe(false));

        test('custom class instance', () =>
          expect((new (class { })).is(String))
            .toBe(false));

        test('custom class with is method', () =>
          expect((new class { static is() { return false; } }).is(String))
            .toBe(false));

        test('custom string class with is method', () =>
          expect((new class { static is(value: any) { return true; } }).is(String))
            .toBe(false));
      });
    });
  });

  describe('built-in objects', () => {

  });

  describe('custom objects', () => {
    describe('with is defined', () => {

    });
    describe('without is defined', () => {

    });
  });
});