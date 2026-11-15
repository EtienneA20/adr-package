import { describe, expect, it } from "vitest";

import { ModuleOptionsError } from "./module-options-error";

describe("ModuleOptionsError", () => {
  it("liste les problèmes avec leur chemin, la racine nommée explicitement", () => {
    const error = new ModuleOptionsError("Reminders", [
      { path: "daysBeforeDue", message: "Trop petit" },
      { path: "", message: "Objet attendu" },
    ]);

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ModuleOptionsError");
    expect(error.moduleName).toBe("Reminders");
    expect(error.issues).toHaveLength(2);
    expect(error.message).toBe(
      "Options du module « Reminders » invalides :\n- daysBeforeDue : Trop petit\n- (racine) : Objet attendu",
    );
  });
});
