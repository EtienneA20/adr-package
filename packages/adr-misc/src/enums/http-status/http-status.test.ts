import { describe, expect, expectTypeOf, it } from "vitest";

import { EHttpStatus } from "./http-status";

describe("EHttpStatus", () => {
  it("associe les noms usuels aux codes HTTP", () => {
    expect(EHttpStatus.OK).toBe(200);
    expect(EHttpStatus.NO_CONTENT).toBe(204);
    expect(EHttpStatus.NOT_FOUND).toBe(404);
    expect(EHttpStatus.UNPROCESSABLE_ENTITY).toBe(422);
    expect(EHttpStatus.SERVICE_UNAVAILABLE).toBe(503);
  });

  it("ne contient que des codes valides et uniques", () => {
    const codes = Object.values(EHttpStatus);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.every((code) => code >= 100 && code <= 599)).toBe(true);
  });

  it("expose le type union des valeurs", () => {
    expectTypeOf(EHttpStatus.CREATED).toEqualTypeOf<201>();
    expectTypeOf<EHttpStatus>().toExtend<number>();
  });
});
