import Ward, { ward } from "../../../../src/wrappers/ward";
import { Bag_withDefaults } from "./bag.mock";

describe("DEFAULT_HIDDEN_PROPERTIES", () => {

});

describe("DEFAULT_PROTECTED_PROPERTIES", () => {
  test("get", () => {
    const bag = new Bag_withDefaults("one");
    const warded = Ward(bag);

    expect(warded.contents)
      .toBe<string>("one");
  });

  describe("try(...)", () => {
    describe("(Ward.Can.Get, propKey)", () => {
      test(" => [any, true]", () => {
        const bag = new Bag_withDefaults("one");
        const warded = ward(bag);

        const [_, canAccess] = warded.try(Ward.Can.Get, "contents");

        expect(canAccess)
          .toStrictEqual(true);
      });

      test(" => [value, any]", () => {
        const bag = new Bag_withDefaults("one");
        const warded = new Ward(bag);

        const [value, _] = warded.try(Ward.Can.Get, "contents");

        expect(value)
          .toStrictEqual("one");
      });

      test("try set => {key: false}", () => {
        const bag = new Bag_withDefaults("one");
        const warded = new Ward(bag);

        expect(warded.try({
          set: {
            contents: "two"
          }
        }).contents.success).toBe(false);
      });

      test("set throws TypeError", () => {
        const bag = new Bag_withDefaults("one");
        const warded = new Ward(bag);

        expect(() =>
          /** @ts-expect-error: protected field cannot be set */
          warded.contents = "3"
        ).toThrow(TypeError);
      });
    });
  });
});