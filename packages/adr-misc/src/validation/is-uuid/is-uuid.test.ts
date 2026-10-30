import { describe, expect, it } from "vitest";

import { isUuid } from "./is-uuid";

const UUID_V4 = "9b2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3d";
const UUID_V7 = "01890a5d-ac96-774b-bcce-b302099a8057";

describe("isUuid", () => {
  it.each([UUID_V4, UUID_V7, UUID_V4.toUpperCase(), "6ba7b810-9dad-11d1-80b4-00c04fd430c8"])(
    "accepte l'UUID %s sans version imposée",
    (value) => {
      expect(isUuid(value)).toBe(true);
    },
  );

  it("accepte l'UUID nul et l'UUID maximal sans version imposée", () => {
    expect(isUuid("00000000-0000-0000-0000-000000000000")).toBe(true);
    expect(isUuid("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF")).toBe(true);
    expect(isUuid("00000000-0000-0000-0000-000000000000", 4)).toBe(false);
  });

  it("vérifie la version demandée", () => {
    expect(isUuid(UUID_V4, 4)).toBe(true);
    expect(isUuid(UUID_V4, 7)).toBe(false);
    expect(isUuid(UUID_V7, 7)).toBe(true);
  });

  it.each([
    "",
    "9b2c6f4e3d1a4f6b8c2d1e5f7a9b0c3d",
    `{${UUID_V4}}`,
    ` ${UUID_V4}`,
    "9b2c6f4e-3d1a-0f6b-8c2d-1e5f7a9b0c3d",
    "9b2c6f4e-3d1a-9f6b-8c2d-1e5f7a9b0c3d",
    "9b2c6f4e-3d1a-4f6b-cc2d-1e5f7a9b0c3d",
    "9b2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3",
    "zb2c6f4e-3d1a-4f6b-8c2d-1e5f7a9b0c3d",
  ])("refuse la chaîne %j", (value) => {
    expect(isUuid(value)).toBe(false);
  });
});
