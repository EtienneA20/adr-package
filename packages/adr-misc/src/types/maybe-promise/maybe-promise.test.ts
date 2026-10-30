import { describe, expectTypeOf, it } from "vitest";

import type { MaybePromise } from "./maybe-promise";

describe("MaybePromise", () => {
  it("accepte une valeur ou une promesse de cette valeur", () => {
    expectTypeOf<MaybePromise<boolean>>().toEqualTypeOf<boolean | PromiseLike<boolean>>();
    expectTypeOf<Promise<boolean>>().toExtend<MaybePromise<boolean>>();
    expectTypeOf<boolean>().toExtend<MaybePromise<boolean>>();
  });

  it("refuse une promesse d'un autre type", () => {
    expectTypeOf<Promise<string>>().not.toExtend<MaybePromise<boolean>>();
  });

  it("se résout en T avec Awaited", () => {
    expectTypeOf<Awaited<MaybePromise<number>>>().toEqualTypeOf<number>();
  });
});
