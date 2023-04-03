import { Bag } from "./bag.mock";
import Ward from '../../../../src/wrappers/ward';

describe("warded", () => {
  describe("protected", () => {
    const bag = new Bag("one");
    const warded = Ward.from(bag, {
      protectedKeys: ["contents"] as const
    });

    test("get", () => {
      expect(warded.contents)
        .toBe<string>("one");
    });

    describe("try", () => {
      test("get [propertyKey] => value", () => {
        expect(warded.try.contents)
          .toBe("one");
      });

      test("set [propertyKey] throws TypeError", () => {
        expect(() =>
          /** @ts-expect-error: protected field cannot be set */
          warded.contents = "3"
        ).toThrow(TypeError);
      });

      describe("(...)", () => {
        describe("(Ward.Can.Get, propKey)", () => {
          test(" => [any, true]", () => {
            const [_, canAccess] = warded.try(Ward.Can.Get, "contents");

            expect(canAccess)
              .toStrictEqual(true);
          });

          test(" => [value, any]", () => {
            const [value, _] = warded.try(Ward.Can.Get, "contents");

            expect(value)
              .toStrictEqual("one");
          });

          test("=> {success: true}", () => {
            expect(warded.try(Ward.Can.Get, "contents").success)
              .toBe(true);
          });

          test("=> {canSee: true}", () => {
            expect(warded.try(Ward.Can.Get, "contents").canGet)
              .toBe(true);
          });

          test("=> {value}", () => {
            expect(warded.try(Ward.Can.Get, "contents").value)
              .toBe("one");
          });

          test("=> {canSet?: undefined}", () => {
            expect(warded.try(Ward.Can.Get, "contents")
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSet
            ).toBe(undefined);
          });

          test("=> {wasSet?: undefined}", () => {
            expect(warded.try(Ward.Can.Get, "contents")
              /** @ts-expect-error: wrong key for the try operation type: */
              .wasSet
            ).toBe(undefined);
          });
        });

        describe("(Ward.Can.Set, propKey)", () => {
          test(" => [any, false]", () => {
            const [_, canAccess] = warded.try(Ward.Can.Set, "contents");

            expect(canAccess)
              .toStrictEqual(false);
          });

          test(" => [undefined, any]", () => {
            const [value, _] = warded.try(Ward.Can.Set, "contents");

            expect(value)
              .toStrictEqual(undefined);
          });

          test("=> {value?: undefined}", () => {
            expect(warded.try(Ward.Can.Set, "contents").value)
              .toBe(undefined);
          });

          test("=> {success: false}", () => {
            expect(warded.try(Ward.Can.Set, "contents").success)
              .toBe(false);
          });

          test("=> {canSee?: undefined}", () => {
            expect(warded.try(Ward.Can.Set, "contents")
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSee
            ).toBe(undefined);
          });

          test("=> {canSet: false}", () => {
            expect(warded.try(Ward.Can.Set, "contents").canSet)
              .toBe(false);
          });

          test("=> {wasSet?: undefined}", () => {
            expect(warded.try(Ward.Can.Set, "contents")
              /** @ts-expect-error: wrong key for the try operation type: */
              .wasSet
            ).toBe(undefined);
          });
        });

        describe("(Ward.Can.Set, propKey, value)", () => {
          test(" => [any, false]", () => {
            const [_, canAccess] = warded.try(Ward.Can.Set, "contents", "two");

            expect(canAccess)
              .toStrictEqual(false);
          });

          test(" => [undefined, any]", () => {
            const [value, _] = warded.try(Ward.Can.Set, "contents", "two");

            expect(value)
              .toStrictEqual(undefined);
          });

          test("=> {value?: undefined}", () => {
            expect(warded.try(Ward.Can.Set, "contents", "two").value)
              .toBe(undefined);
          });

          test("=> {success: false}", () => {
            expect(warded.try(Ward.Can.Set, "contents", "two").success)
              .toBe(false);
          });

          test("=> {canSee?: undefined}", () => {
            expect(warded.try(Ward.Can.Set, "contents", "two")
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSee
            ).toBe(undefined);
          });

          test("=> {canSet: false}", () => {
            expect(warded.try(Ward.Can.Set, "contents", "two")
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSet
            ).toBe(undefined);
          });

          test("=> {wasSet: false}", () => {
            expect(warded.try(Ward.Can.Set, "contents", "two").wasSet)
              .toBe(false);
          });
        });

        describe("({get: [propKey]})", () => {
          test(" => [any, true]", () => {
            const { contents: [_, canAccess] } = warded.try({ get: ["contents"] });

            expect(canAccess)
              .toStrictEqual(true);
          });

          test(" => [value, any]", () => {
            const { contents: [value] } = warded.try({ get: ["contents"] });

            expect(value)
              .toStrictEqual("one");
          });

          test("=> {value}", () => {
            expect(warded.try({ get: ["contents"] }).contents.value)
              .toBe("one");
          });

          test("=> {success: true}", () => {
            expect(warded.try({ get: ["contents"] }).contents.success)
              .toBe(true);
          });

          test("=> {canSee: true}", () => {
            expect(warded.try({ get: ["contents"] }).contents.canGet)
              .toBe(true);
          });

          test("=> {canSet?: undefined}", () => {
            expect(warded.try({ get: ["contents"] }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSet
            ).toBe(undefined);
          });

          test("=> {wasSet?: undefined}", () => {
            expect(warded.try({ get: ["contents"] }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .wasSet
            ).toBe(undefined);
          });
        });

        describe("({set: [propKey]})", () => {
          test(" => [any, false]", () => {
            const { contents: [_, canAccess] } = warded.try({ set: ["contents"] });

            expect(canAccess)
              .toStrictEqual(false);
          });

          test(" => [undefined, any]", () => {
            const { contents: [value] } = warded.try({ set: ["contents"] });

            expect(value)
              .toStrictEqual(undefined);
          });

          test("=> {value?: undefined}", () => {
            expect(warded.try({ set: ["contents"] }).contents.value)
              .toBe(undefined);
          });

          test("=> {success: false}", () => {
            expect(warded.try({ set: ["contents"] }).contents.success)
              .toBe(false);
          });

          test("=> {canSet: false}", () => {
            expect(warded.try({ set: ["contents"] }).contents.canSet)
              .toBe(false);
          });

          test("=> {canSee?: undefined}", () => {
            expect(warded.try({ set: ["contents"] }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSee
            ).toBe(undefined);
          });

          test("=> {wasSet?: undefined}", () => {
            expect(warded.try({ set: ["contents"] }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .wasSet
            ).toBe(undefined);
          });
        });

        describe("({set: { propKey: value }})", () => {
          test(" => [any, false]", () => {
            const { contents: [_, canAccess] } = warded.try({ set: { contents: "two" } });

            expect(canAccess)
              .toStrictEqual(false);
          });

          test(" => [undefined, any]", () => {
            const { contents: [value] } = warded.try({ set: { contents: "two" } });

            expect(value)
              .toStrictEqual(undefined);
          });

          test("=> {value?: undefined}", () => {
            expect(warded.try({ set: { contents: "two" } }).contents.value)
              .toBe(undefined);
          });

          test("=> {success: false}", () => {
            expect(warded.try({ set: { contents: "two" } }).contents.success)
              .toBe(false);
          });

          test("=> {wasSet: false}", () => {
            expect(warded.try({ set: { contents: "two" } }).contents.wasSet)
              .toBe(false);
          });

          test("=> {canSet: undefined}", () => {
            expect(warded.try({ set: { contents: "two" } }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSet
            ).toBe(undefined);
          });

          test("=> {canSee?: undefined}", () => {
            expect(warded.try({ set: { contents: "two" } }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .canSee
            ).toBe(undefined);
          });
        });

        describe("({get: [propKey], set: [propKey]})", () => {
          test(" => [any, false]", () => {
            const {
              contents: [_, success]
            } = warded
              .try({ get: ["contents"], set: ["contents"] });

            expect(success)
              .toStrictEqual(false);
          });

          test(" => [value, any]", () => {
            const { contents: [value] } = warded
              .try({ get: ["contents"], set: ["contents"] });

            expect(value)
              .toStrictEqual("one");
          });

          test("=> {value}", () => {
            expect(warded.try({ get: ["contents"], set: ["contents"] }).contents.value)
              .toBe("one");
          });

          test("=> {success: false}", () => {
            expect(warded.try({ get: ["contents"], set: ["contents"] }).contents.success)
              .toBe(false);
          });

          test("=> {canSee: true}", () => {
            expect(warded.try({ get: ["contents"], set: ["contents"] }).contents.canGet)
              .toBe(true);
          });

          test("=> {canSet: false}", () => {
            expect(warded.try({ get: ["contents"], set: ["contents"] }).contents.canSet)
              .toBe(false);
          });

          test("=> {wasSet?: undefined}", () => {
            expect(warded.try({ get: ["contents"], set: ["contents"] }).contents
              /** @ts-expect-error: wrong key for the try operation type: */
              .wasSet
            ).toBe(undefined);
          });

        });
      });
    });
  });

  describe("hidden", () => {

  });
});

describe("un-warded", () => {

  // Missing props should act the same as hidden props
  describe("missing", () => {

  });
});