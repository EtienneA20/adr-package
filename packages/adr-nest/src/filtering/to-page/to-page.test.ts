import { pageSchema } from "@etiennea20/adr-misc/contract";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toPage } from "./to-page";

const criteria = { page: 2, pageSize: 2 };

describe("toPage", () => {
  it("retire la ligne en plus et indique la page suivante", () => {
    expect(toPage(["c", "d", "e"], criteria, 5)).toEqual({
      items: ["c", "d"],
      page: 2,
      pageSize: 2,
      total: 5,
      pageCount: 3,
      hasNextPage: true,
    });
  });

  it("omet total et pageCount sans comptage", () => {
    expect(toPage(["c"], criteria)).toEqual({
      items: ["c"],
      page: 2,
      pageSize: 2,
      hasNextPage: false,
    });
  });

  it("produit une page que le front valide avec pageSchema", () => {
    expect(pageSchema(z.string()).parse(toPage([], { page: 1, pageSize: 20 }, 0))).toMatchObject({
      total: 0,
      pageCount: 0,
    });
  });
});
