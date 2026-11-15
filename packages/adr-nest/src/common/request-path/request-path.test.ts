import { describe, expect, it } from "vitest";

import { requestPath } from "./request-path";

describe("requestPath", () => {
  it("retire la chaîne de requête et le fragment", () => {
    expect(requestPath("/livres/export?format=csv&token=secret")).toBe("/livres/export");
    expect(requestPath("/livres#haut")).toBe("/livres");
    expect(requestPath("/livres")).toBe("/livres");
  });

  it("renvoie / pour une URL absente, vide ou réduite aux paramètres", () => {
    expect(requestPath(undefined)).toBe("/");
    expect(requestPath("")).toBe("/");
    expect(requestPath("?a=1")).toBe("/");
  });
});
