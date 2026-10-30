import { describe, expect, expectTypeOf, it } from "vitest";

import { ESortDirection } from "./sort-direction";

describe("ESortDirection", () => {
  it("utilise des valeurs en minuscules", () => {
    expect(ESortDirection).toEqual({ ASC: "asc", DESC: "desc" });
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf<ESortDirection>().toEqualTypeOf<"asc" | "desc">();
  });
});
