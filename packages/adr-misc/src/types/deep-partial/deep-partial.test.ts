import { describe, expectTypeOf, it } from "vitest";

import type { DeepPartial } from "./deep-partial";

interface ISettings {
  loans: { maxDays: number; maxRenewals: number };
  genres: { code: string; label: string }[];
  openedAt: Date;
  onChange: (value: number) => void;
  tags: Set<string>;
}

describe("DeepPartial", () => {
  it("rend facultatives les propriétés de tous les niveaux", () => {
    expectTypeOf({ loans: { maxDays: 28 } }).toExtend<DeepPartial<ISettings>>();
    expectTypeOf({}).toExtend<DeepPartial<ISettings>>();
    expectTypeOf<DeepPartial<ISettings>["loans"]>().toEqualTypeOf<
      { maxDays?: number; maxRenewals?: number } | undefined
    >();
  });

  it("rend partiels les éléments des tableaux sans les rendre facultatifs", () => {
    expectTypeOf<DeepPartial<{ code: string }[]>>().toEqualTypeOf<{ code?: string }[]>();
    expectTypeOf<DeepPartial<readonly [{ code: string }]>>().toEqualTypeOf<
      readonly [{ code?: string }]
    >();
  });

  it("conserve tels quels les primitives, dates, fonctions et collections", () => {
    expectTypeOf<DeepPartial<string>>().toEqualTypeOf<string>();
    expectTypeOf<DeepPartial<ISettings>["openedAt"]>().toEqualTypeOf<Date | undefined>();
    expectTypeOf<DeepPartial<ISettings>["onChange"]>().toEqualTypeOf<
      ((value: number) => void) | undefined
    >();
    expectTypeOf<DeepPartial<ISettings>["tags"]>().toEqualTypeOf<Set<string> | undefined>();
  });

  it("refuse une propriété de mauvais type", () => {
    expectTypeOf({ loans: { maxDays: "28" } }).not.toExtend<DeepPartial<ISettings>>();
  });
});
