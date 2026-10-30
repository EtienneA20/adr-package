import { describe, expect, it } from "vitest";

import { isUrl } from "./is-url";

describe("isUrl", () => {
  it.each([
    "https://bibliotheque.fr",
    "http://bibliotheque.fr/",
    "https://www.bibliotheque.fr/livres?page=2&tri=titre#resultats",
    "HTTPS://BIBLIOTHEQUE.FR",
    "https://catalogue.bibliotheque.paris.fr:8443/api",
    "http://localhost:3000/livres",
    "http://127.0.0.1",
    "http://[::1]:8080/",
    "https://utilisateur:secret@bibliotheque.fr",
    "https://médiathèque.fr",
    "https://xn--mdiathque-b4ab.xn--p1ai",
  ])("accepte l'URL %s", (value) => {
    expect(isUrl(value)).toBe(true);
  });

  it.each([
    "",
    "bibliotheque.fr",
    "//bibliotheque.fr",
    "https://",
    "https://bibliotheque",
    "https://bibliotheque.f",
    "https://-bibliotheque.fr",
    "https://biblio theque.fr",
    "https://bibliotheque.fr/mon livre",
    "https://bibliotheque.fr:0",
    "https://bibliotheque.fr:70000",
    "https://bibliotheque.fr:abc",
    "https://999.1.1.1.1",
    "mailto:contact@bibliotheque.fr",
    "ftp://fichiers.bibliotheque.fr",
  ])("refuse la chaîne %j avec les options par défaut", (value) => {
    expect(isUrl(value)).toBe(false);
  });

  it("accepte d'autres protocoles quand ils sont fournis", () => {
    expect(isUrl("ftp://fichiers.bibliotheque.fr", { protocols: ["FTP"] })).toBe(true);
    expect(isUrl("https://bibliotheque.fr", { protocols: ["ftp"] })).toBe(false);
  });

  it("accepte le port maximal 65535", () => {
    expect(isUrl("https://bibliotheque.fr:65535")).toBe(true);
  });
});
