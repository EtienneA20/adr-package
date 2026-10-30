import { describe, expect, it } from "vitest";

import { intersection } from "./intersection";

describe("intersection", () => {
  it("renvoie les éléments communs sans doublon, dans l'ordre du premier tableau", () => {
    expect(intersection([3, 1, 2, 2, 3], [2, 3, 4])).toEqual([3, 2]);
  });

  it("compare des objets par la clé fournie et garde ceux du premier tableau", () => {
    const first = [
      { id: 1, title: "Germinal" },
      { id: 2, title: "Nana" },
    ];
    const second = [{ id: 2, title: "Nana (réédition)" }];
    expect(intersection(first, second, (book) => book.id)).toEqual([{ id: 2, title: "Nana" }]);
  });

  it("renvoie un tableau vide sans élément commun", () => {
    expect(intersection(["a"], ["b"])).toEqual([]);
    expect(intersection([], ["b"])).toEqual([]);
  });

  it("ne modifie pas les tableaux d'origine", () => {
    const items = Object.freeze([1, 2]);
    intersection(items, Object.freeze([2]));
    expect(items).toEqual([1, 2]);
  });
});
