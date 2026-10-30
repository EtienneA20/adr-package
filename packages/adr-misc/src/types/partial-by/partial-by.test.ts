import { describe, expectTypeOf, it } from "vitest";

import type { PartialBy } from "./partial-by";

interface ILoan {
  id: string;
  bookId: string;
  borrowedAt: Date;
  note?: string;
}

describe("PartialBy", () => {
  it("rend facultatives uniquement les clés indiquées", () => {
    expectTypeOf<PartialBy<ILoan, "id" | "borrowedAt">>().toEqualTypeOf<{
      id?: string;
      bookId: string;
      borrowedAt?: Date;
      note?: string;
    }>();
  });

  it("accepte un objet sans les clés devenues facultatives", () => {
    expectTypeOf({ bookId: "b-1" }).toExtend<PartialBy<ILoan, "id" | "borrowedAt">>();
    expectTypeOf({ id: "l-1" }).not.toExtend<PartialBy<ILoan, "id" | "borrowedAt">>();
  });

  it("refuse une clé qui n'appartient pas au type", () => {
    // @ts-expect-error -- "lost" n'est pas une clé de ILoan
    expectTypeOf<PartialBy<ILoan, "lost">>().not.toBeNever();
  });
});
