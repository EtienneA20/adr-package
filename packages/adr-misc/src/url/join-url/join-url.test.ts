import { describe, expect, it } from "vitest";

import { joinUrl } from "./join-url";

describe("joinUrl", () => {
  it("assemble des segments avec un seul / entre chacun", () => {
    expect(joinUrl("https://api.bibliotheque.fr", "v1", "livres")).toBe(
      "https://api.bibliotheque.fr/v1/livres",
    );
  });

  it("supprime les / en double aux jonctions", () => {
    expect(joinUrl("https://api.bibliotheque.fr/", "/v1/", "//livres")).toBe(
      "https://api.bibliotheque.fr/v1/livres",
    );
  });

  it("conserve le // du protocole et les / internes", () => {
    expect(joinUrl("https://api.bibliotheque.fr/v1", "livres/42")).toBe(
      "https://api.bibliotheque.fr/v1/livres/42",
    );
  });

  it("conserve le / initial du premier segment et le / final du dernier", () => {
    expect(joinUrl("/api", "adherents/")).toBe("/api/adherents/");
    expect(joinUrl("/", "livres")).toBe("/livres");
  });

  it("ignore les segments vides ou réduits à /", () => {
    expect(joinUrl("api", "", "/", "livres")).toBe("api/livres");
  });

  it("n'ajoute pas de / après une base réduite à un protocole", () => {
    expect(joinUrl("https://", "/api.bibliotheque.fr", "livres")).toBe(
      "https://api.bibliotheque.fr/livres",
    );
  });

  it("conserve la query string du dernier segment", () => {
    expect(joinUrl("/api/", "/livres?page=2")).toBe("/api/livres?page=2");
  });

  it("gère les cas limites", () => {
    expect(joinUrl()).toBe("");
    expect(joinUrl("livres")).toBe("livres");
    expect(joinUrl("", "")).toBe("");
  });
});
