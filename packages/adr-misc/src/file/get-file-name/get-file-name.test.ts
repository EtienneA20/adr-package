import { describe, expect, it } from "vitest";

import { getFileName } from "./get-file-name";

describe("getFileName", () => {
  it.each([
    ["/uploads/2026/couverture.jpg", "couverture.jpg"],
    ["C:\\Users\\lecteur\\liste.pdf", "liste.pdf"],
    ["couverture.jpg", "couverture.jpg"],
    ["docs/archives/", "archives"],
    ["docs/.env", ".env"],
    ["", ""],
  ])("renvoie le nom de %j", (path, expected) => {
    expect(getFileName(path)).toBe(expected);
  });
});
