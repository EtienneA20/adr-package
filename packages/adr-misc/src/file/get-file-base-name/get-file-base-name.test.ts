import { describe, expect, it } from "vitest";

import { getFileBaseName } from "./get-file-base-name";

describe("getFileBaseName", () => {
  it.each([
    ["/uploads/2026/couverture.jpg", "couverture"],
    ["C:\\Documents\\archive.tar.gz", "archive.tar"],
    ["notice.PDF", "notice"],
    [".env", ".env"],
    ["LISEZMOI", "LISEZMOI"],
    ["docs/archives/", "archives"],
    ["", ""],
  ])("renvoie le nom de base de %j", (path, expected) => {
    expect(getFileBaseName(path)).toBe(expected);
  });
});
