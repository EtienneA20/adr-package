import { describe, expect, expectTypeOf, it } from "vitest";

import { EMimeType } from "./mime-type";

describe("EMimeType", () => {
  it("associe les formats courants à leur type MIME", () => {
    expect(EMimeType.JSON).toBe("application/json");
    expect(EMimeType.CSV).toBe("text/csv");
    expect(EMimeType.XLSX).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(EMimeType.SVG).toBe("image/svg+xml");
  });

  it("ne contient que des types MIME bien formés et uniques", () => {
    const types = Object.values(EMimeType);
    expect(new Set(types).size).toBe(types.length);
    expect(types.every((type) => /^[a-z]+\/[\w.+-]+$/.test(type))).toBe(true);
  });

  it("expose des types littéraux", () => {
    expectTypeOf(EMimeType.PDF).toEqualTypeOf<"application/pdf">();
    expectTypeOf<EMimeType>().toExtend<string>();
  });
});
