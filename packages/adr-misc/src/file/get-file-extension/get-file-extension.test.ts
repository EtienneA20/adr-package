import { describe, expect, it } from "vitest";

import { getFileExtension } from "./get-file-extension";

describe("getFileExtension", () => {
  it.each([
    ["couverture.jpg", "jpg"],
    ["Couverture.JPG", "jpg"],
    ["archive.tar.gz", "gz"],
    ["/uploads/2026/notice.pdf", "pdf"],
    ["C:\\Documents\\catalogue.XLSX", "xlsx"],
    ["dossier.v2/LISEZMOI", ""],
    [".env", ""],
    [".env.local", "local"],
    ["archive.", ""],
    ["LISEZMOI", ""],
    ["", ""],
  ])("renvoie l'extension de %j", (fileName, expected) => {
    expect(getFileExtension(fileName)).toBe(expected);
  });
});
