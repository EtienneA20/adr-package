import { describe, expect, it } from "vitest";

import { measureFilter } from "./measure-filter";

const limits = { maxDepth: 3, maxConditions: 4 };
const condition = { field: "title", op: "eq", value: "Dune" };

function nestNot(levels: number): unknown {
  let node: unknown = condition;
  for (let index = 0; index < levels; index += 1) node = { not: node };
  return node;
}

describe("measureFilter", () => {
  it("accepte une condition seule (profondeur 0)", () => {
    expect(measureFilter(condition, limits)).toBeUndefined();
  });

  it("accepte un arbre à la profondeur maximale", () => {
    expect(measureFilter(nestNot(3), limits)).toBeUndefined();
    expect(
      measureFilter({ and: [condition, { or: [condition, { not: condition }] }] }, limits),
    ).toBeUndefined();
  });

  it("refuse un arbre trop profond", () => {
    expect(measureFilter(nestNot(4), limits)).toEqual({
      limit: "maxDepth",
      message: "Le filtre dépasse 3 niveaux de groupes imbriqués.",
    });
    expect(measureFilter({ and: [{ or: [{ and: [{ or: [condition] }] }] }] }, limits)?.limit).toBe(
      "maxDepth",
    );
  });

  it("accepte le nombre maximal de conditions", () => {
    expect(measureFilter({ and: [condition, condition, condition, condition] }, limits)).toBe(
      undefined,
    );
  });

  it("refuse trop de conditions, réparties dans plusieurs groupes", () => {
    expect(
      measureFilter(
        { or: [{ and: [condition, condition] }, { and: [condition, condition, condition] }] },
        limits,
      ),
    ).toEqual({ limit: "maxConditions", message: "Le filtre dépasse 4 conditions." });
  });

  it("compte les nœuds invalides comme des conditions", () => {
    expect(measureFilter({ and: [1, "x", null, {}, []] }, limits)?.limit).toBe("maxConditions");
  });

  it("s'arrête sur un arbre immense sans débordement de pile", () => {
    expect(measureFilter(nestNot(100_000), limits)?.limit).toBe("maxDepth");
    expect(
      measureFilter({ and: Array.from({ length: 100_000 }, () => condition) }, limits)?.limit,
    ).toBe("maxConditions");
  });

  it("traite un groupe dont le contenu n'est pas un tableau comme un seul enfant", () => {
    expect(measureFilter({ and: condition }, limits)).toBeUndefined();
  });
});
