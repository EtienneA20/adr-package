import { describe, expect, it } from "vitest";

import { getMimeType } from "./get-mime-type";

describe("getMimeType", () => {
  it.each([
    ["notice.pdf", "application/pdf"],
    ["Couverture.JPG", "image/jpeg"],
    ["couverture.jpeg", "image/jpeg"],
    [
      "/exports/catalogue.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    ["C:\\Exports\\liste.csv", "text/csv"],
    ["livre.epub", "application/epub+zip"],
    ["archive.tar.gz", "application/gzip"],
    ["logo.svg", "image/svg+xml"],
    ["compte-rendu.odt", "application/vnd.oasis.opendocument.text"],
    ["sauvegarde.7z", "application/x-7z-compressed"],
  ])("renvoie le type MIME de %j", (fileName, expected) => {
    expect(getMimeType(fileName)).toBe(expected);
  });

  it.each(["donnees.bin", "LISEZMOI", ".env", "archive.", "", "objet.constructor", "a.__proto__"])(
    "renvoie application/octet-stream pour %j",
    (fileName) => {
      expect(getMimeType(fileName)).toBe("application/octet-stream");
    },
  );
});
