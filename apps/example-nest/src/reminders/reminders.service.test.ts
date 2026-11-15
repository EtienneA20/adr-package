import { ModuleOptionsError, PermissionsModule } from "@etiennea20/adr-nest";
import { Test } from "@nestjs/testing";
import { describe, expect, it } from "vitest";

import { permissions } from "../auth";
import { RemindersModule } from "./reminders.module";
import { RemindersService } from "./reminders.service";

async function createService(daysBeforeDue?: number): Promise<RemindersService> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      PermissionsModule.forRoot({ permissions }), // requis par LoansModule
      RemindersModule.forRoot(daysBeforeDue === undefined ? {} : { daysBeforeDue }),
    ],
  }).compile();
  return moduleRef.get(RemindersService);
}

describe("RemindersService", () => {
  it("liste les emprunts en cours à rendre sous 3 jours par défaut", async () => {
    const service = await createService();

    expect(service.dueSoon(new Date("2026-11-18T09:00:00Z")).map((loan) => loan.id)).toEqual([
      "emprunt-2",
    ]);
    expect(service.dueSoon(new Date("2026-11-10T09:00:00Z"))).toEqual([]);
  });

  it("applique le délai configuré et ignore les emprunts rendus", async () => {
    const service = await createService(20);

    expect(service.dueSoon(new Date("2026-11-15T09:00:00Z")).map((loan) => loan.id)).toEqual([
      "emprunt-1",
      "emprunt-2",
    ]);
  });

  it("refuse au démarrage un délai hors limites", async () => {
    await expect(createService(0)).rejects.toBeInstanceOf(ModuleOptionsError);
  });
});
