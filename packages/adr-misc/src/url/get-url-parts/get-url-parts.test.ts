import { describe, expect, it } from "vitest";

import { getUrlParts } from "./get-url-parts";

describe("getUrlParts", () => {
  it("découpe une URL complète", () => {
    expect(getUrlParts("https://api.bibliotheque.fr:8443/livres?page=2#resultats")).toEqual({
      protocol: "https",
      host: "api.bibliotheque.fr:8443",
      hostname: "api.bibliotheque.fr",
      port: "8443",
      pathname: "/livres",
      query: "page=2",
      hash: "resultats",
    });
  });

  it("met le protocole et le nom d'hôte en minuscules", () => {
    const parts = getUrlParts("HTTPS://Bibliotheque.FR/Livres");
    expect(parts.protocol).toBe("https");
    expect(parts.hostname).toBe("bibliotheque.fr");
    expect(parts.pathname).toBe("/Livres");
  });

  it("écarte les identifiants", () => {
    const parts = getUrlParts("https://lecteur:secret@bibliotheque.fr/compte");
    expect(parts.host).toBe("bibliotheque.fr");
    expect(parts.hostname).toBe("bibliotheque.fr");
  });

  it("reconnaît une adresse IPv6 entre crochets", () => {
    expect(getUrlParts("http://[::1]:8080/api")).toMatchObject({
      host: "[::1]:8080",
      hostname: "[::1]",
      port: "8080",
    });
  });

  it("renvoie des composants vides pour une URL relative", () => {
    expect(getUrlParts("/livres?page=2&tri=titre")).toEqual({
      protocol: "",
      host: "",
      hostname: "",
      port: "",
      pathname: "/livres",
      query: "page=2&tri=titre",
      hash: "",
    });
  });

  it("gère les URL sans chemin et la chaîne vide", () => {
    expect(getUrlParts("https://bibliotheque.fr")).toMatchObject({ pathname: "", query: "" });
    expect(getUrlParts("")).toEqual({
      protocol: "",
      host: "",
      hostname: "",
      port: "",
      pathname: "",
      query: "",
      hash: "",
    });
  });

  it("gère les URL non hiérarchiques", () => {
    expect(getUrlParts("mailto:contact@bibliotheque.fr")).toMatchObject({
      protocol: "mailto",
      host: "",
      pathname: "contact@bibliotheque.fr",
    });
  });

  it("renvoie un hôte vide quand l'autorité est mal formée", () => {
    expect(getUrlParts("https://bibliotheque.fr:abc/livres")).toMatchObject({
      host: "",
      hostname: "",
      port: "",
      pathname: "/livres",
    });
  });

  it("ne garde que le premier ? et le premier # comme séparateurs", () => {
    expect(getUrlParts("/recherche?q=a?b#x#y")).toMatchObject({ query: "q=a?b", hash: "x#y" });
  });
});
