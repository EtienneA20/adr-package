import { describe, expectTypeOf, it } from "vitest";

import type { Prettify } from "./prettify";

interface IBook {
  readonly id: string;
  title: string;
  subtitle?: string;
}

describe("Prettify", () => {
  it("aplatit une intersection en un seul type objet équivalent", () => {
    expectTypeOf<Prettify<Omit<IBook, "id"> & { isDraft: true }>>().toEqualTypeOf<{
      title: string;
      subtitle?: string;
      isDraft: true;
    }>();
  });

  it("conserve les modificateurs readonly et facultatif", () => {
    expectTypeOf<Prettify<IBook>>().toEqualTypeOf<{
      readonly id: string;
      title: string;
      subtitle?: string;
    }>();
  });
});
